# Architecture brief

A short tour of the four moving parts that make this demo tick:
**Pub/Sub**, **SSE**, **vector embeddings in Valkey**, **similarity search**, and a
**WebMCP-style** action layer for the AI agent.

Pair this with the longer `CLAUDE.md` if you need the full implementation
notes — this file is just a "what and why" for reviewers and judges.

---

## 1. Pub/Sub on Valkey

**What it is.** Valkey's publish/subscribe channels are the spine of every
real-time interaction in the app. Producers `PUBLISH` JSON payloads to a
named channel; subscribers receive them with sub-millisecond latency. We use
one channel per signed-in user: `user:<userId>:events`.

**What we publish:**

| Event              | Source                   | Meaning                                               |
| ------------------ | ------------------------ | ----------------------------------------------------- |
| `cart.updated`     | `services/cartOps.js`    | Any cart mutation (add, remove, status, clear).       |
| `chat.message`     | `services/chat.js`       | A user or assistant turn was persisted.               |
| `chat.tool_call`   | `services/chat.js`       | Agent invoked a tool (search, filter, add-to-cart…). |
| `chat.tool_result` | `services/chat.js`       | A tool returned; result row persisted.                |
| `chat.cleared`     | `services/chat.js`       | Chat history wiped — sync other tabs.                 |
| `ui.command`       | `services/tools.js`      | WebMCP-style instruction for the virtual AI cursor.   |

**Why two connections.** `lib/valkey.js` builds two clients: one for normal
commands, one dedicated to subscribers. Redis-protocol subscribers can't
issue other commands on the same socket, so this split is required.

**Graceful fallback.** `lib/bus.js` checks `isReady()` before publishing. If
Valkey is unreachable, it falls back to an in-process `EventEmitter` so the
dev server never hard-fails.

---

## 2. SSE (Server-Sent Events) — the browser bridge

Pub/Sub gets events from any backend producer to any backend subscriber.
SSE gets them from the backend to the user's browser tabs.

**Endpoint:** `GET /api/stream` (auth-gated).
On connect, it:

1. Subscribes that connection to `user:<userId>:events` via the bus.
2. Sends a `hello` event with the current cart snapshot, so a fresh tab has
   correct state without an extra round trip.
3. Forwards every event from the bus down the wire as
   `event: <type>\ndata: <json>\n\n`.
4. Heartbeats every 25 s so proxies don't kill the connection.

**Browser side:** `store/stream.js` opens a single native `EventSource`
with `withCredentials: true`. Known event types fan out into the right
Zustand store (`cart`, `chat`, `cursor`).
Reconnects with exponential backoff on disconnect.

**Why SSE over WebSockets.** One-way server→client traffic, plain HTTP,
auto-reconnect built in, works through any proxy. No protocol upgrade
headache.

**Multi-device demo.** Sign in to Chrome and Firefox with the same account.
Add to cart in one — the other updates in under 100 ms. That handoff is
**Valkey pub/sub** carrying the event from the producer process to the
SSE-serving process, then SSE pushing it to the second browser.

---

## 3. Vector embeddings stored in Valkey

We use Valkey not just as a cache, but as the **primary store** for our
semantic search index.

**Model.** `Xenova/all-MiniLM-L6-v2`, 384-dimensional sentence embeddings,
~22 MB quantized. Runs on CPU in Node via `@huggingface/transformers` —
no external API, no GPU. First call downloads weights to
`~/.cache/huggingface`; cached after that.

**Storage layout.** Two Valkey keys, both hashes:

```
embeddings:vectors   HASH   field=<productId>   value=base64(Float32 bytes)
embeddings:meta      HASH   { model, dim, count, builtAt }
```

A 384-float vector is 1.5 KB raw, base64-encoded for clean text storage in
the hash. `embeddings:meta` doubles as a cache-invalidation marker.

**Build.** `npm run seed:embeddings` (in `backend/`):

1. Pulls every active product from SQLite.
2. Composes a "source text" from `name + brand + tags + short_description +
   description` — enough signal without overweighting any one field.
3. Embeds each one (mean pooled, L2 normalized).
4. Clears the existing index, writes all vectors in a single `HSET`, and
   updates `embeddings:meta`.

**Why Valkey for this.** Embedding files want to be:
fast to load on cold start, easy to update atomically, accessible from
multiple worker processes, and durable enough to survive a restart of the
API. A Valkey hash hits all four with one command per operation.

**Upgrade path.** When the Valkey Search module is enabled, the same code
path swaps to `FT.CREATE … VECTOR HNSW` + `FT.SEARCH … =>[KNN k=…]`
inside `lib/vectorStore.js`. Nothing above it changes.

---

## 4. Similarity search

Built on top of the index above. Lives in `services/semanticSearch.js`.

**Query path:**

1. Embed the user's query string with the same model used at seed time
   (dimensions must match).
2. Load all product vectors from Valkey. Cached in-process; invalidated
   when `embeddings:meta.builtAt` or `count` changes, so re-running
   `seed:embeddings` is enough to refresh.
3. Score every vector against the query with cosine similarity.
   Vectors are L2-normalized at embed time, so cosine is just a dot
   product — a tight `for` loop, microseconds for ~50 products.
4. Take top-K, optionally filter by category / price / minScore, and join
   with SQLite for the full product payload.

**Where it shows up:**

- `GET /api/search/semantic?q=&k=&categoryId=&minPrice=&maxPrice=` — direct
  endpoint for the frontend.
- `semantic_search` tool exposed to the AI agent. The agent reaches for it
  on **descriptive or conceptual** queries like "something to keep my
  coffee warm" or "a minimalist gift around ₹3000" — cases where keyword
  search would miss the intent.

---

## 5. WebMCP-style action layer

The agent doesn't just answer questions — it **drives the storefront**.
Apply filters, open product pages, add items to the cart, highlight things.

The shape is borrowed from MCP (Model Context Protocol): a clean catalog
of tools the model can invoke, each with a JSON schema. Because these tools
target the **web UI** rather than a generic backend, we call the layer
WebMCP-style.

**Tool catalog** (see `services/tools.js`):

| Tool                | Effect                                               |
| ------------------- | ---------------------------------------------------- |
| `search_products`   | Keyword search over name/brand/tags.                 |
| `semantic_search`   | Vector search via Valkey (see §4).                   |
| `get_product`       | Full product detail.                                 |
| `check_stock`       | Live inventory check.                                |
| `apply_filter`      | Navigate `/shop` with category/price filters.        |
| `open_product`      | Route to a product detail page.                      |
| `add_to_cart`       | Add an item (supports `status="draft"` for tentative picks). |
| `remove_from_cart`  | Remove an item.                                      |
| `set_cart_status`   | Convert draft picks to active and vice versa.        |
| `highlight`         | Flag a UI element without changing state.            |

**How a turn flows:**

1. User sends a message → `POST /api/agent/chat`.
2. The agent loop in `services/chat.js` calls Groq (`openai/gpt-oss-120b`)
   with the full tool registry.
3. If the model emits `tool_calls`:
   - For **action** tools, we publish a `ui.command` event to the user's
     Valkey channel **before** mutating server state.
   - The frontend (`store/cursor.js`, `components/common/AICursor.jsx`)
     receives the command via SSE and animates a virtual cursor that
     flies to the right `[data-ai-target=...]` element and clicks /
     highlights it.
   - The cursor click is timed ~700 ms ahead of the state mutation so the
     visual causality reads naturally.
4. The tool result is persisted, `chat.tool_result` broadcasts, and the
   loop continues until the model emits a final answer.

**Why this matters.** Anchoring agent actions to the same UI a human
shopper uses is the demo's headline trick — the user literally watches the
AI shop. Pub/Sub is what makes the timing tight enough for the illusion to
hold across multiple devices.

---

## How the pieces fit together

```
                ┌────────────────────────────────────┐
   Browser ─SSE─┤  /api/stream  (per-user channel)   │
                └───────▲───────────────▲────────────┘
                        │               │
              ┌─────────┴─────┐  ┌──────┴──────────────┐
              │ cart routes   │  │ agent loop          │
              │ services/cart │  │ services/chat       │
              │ Ops.js        │  │ services/tools.js   │
              └───────┬───────┘  └─────────┬───────────┘
                      │                    │
                      └────► Valkey Pub/Sub ◄────┐
                            (lib/bus.js)         │
                                                 │
              ┌──────────────────────────────────┘
              │ semantic_search tool ──► services/semanticSearch.js
              │                          │
              │                          ▼
              │           Valkey HASH: embeddings:vectors
              │                         embeddings:meta
              │                          (lib/vectorStore.js)
              │
              └─► all other tools (CRUD on SQLite, ui.command publish)
```

**TL;DR for judges:** Valkey is doing two distinct, load-bearing jobs in
this app — a real-time pub/sub bus that keeps every device and the agent's
virtual cursor in sync, and a vector store that powers semantic product
search. SQLite remains the system of record for durable business data
(users, products, carts, chat history). Each datastore is doing what it's
best at.
