# Backend (Node.js + SQLite)

Minimal REST API for the Valkey e-commerce demo. SQLite is used today as a placeholder; data shapes match the contracts in `../HACKATHON.md` so we can swap to Valkey later without changing frontend code.

## Stack

- Node.js + Express 4
- `better-sqlite3` (synchronous, file-backed)
- `uuid` v7 (for `domain:uuidv7` IDs from the contract)
- `cors` enabled for the React dev server

## Setup

```bash
cd backend
npm install
npm run seed                # creates data/app.db with categories, vendors, products
npm run seed:embeddings     # generates 384-dim embeddings, stores them in Valkey
npm run dev                 # http://localhost:4000  (uses node --watch)
# or:
npm start
```

`npm run reset` deletes the SQLite file and re-seeds. Re-run `npm run seed:embeddings` afterwards (or any time products change).

The DB file lives at `backend/data/app.db`. Override with `DB_PATH=...`. Override port with `PORT=...`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health probe + product count |
| GET | `/api/categories` | All categories with parent/children links |
| GET | `/api/categories/:id` | Single category |
| GET | `/api/categories/:id/products` | Products in a category (incl. children) |
| GET | `/api/vendors` | All vendors |
| GET | `/api/vendors/:id` | Single vendor |
| GET | `/api/vendors/:id/products` | Products by vendor |
| GET | `/api/products` | List products with filters |
| GET | `/api/products/:id` | Single product |
| GET | `/api/search` | Search with `q`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `pageSize`. Returns results + `facets.brands` + `facets.categories`. |
| GET | `/api/search/suggest` | Autocomplete: `?q=...&limit=8`. Returns `{suggestions: [{name, brand}]}`. |
| GET | `/api/search/semantic` | Vector similarity search. `?q=...&k=6&categoryId=&minPrice=&maxPrice=`. Returns ranked results with similarity scores. Requires `npm run seed:embeddings` first. |
| POST | `/api/auth/register` | `{email, password, firstName?}` → sets `sid` cookie, returns `{user}` |
| POST | `/api/auth/login` | `{email, password}` → sets `sid` cookie, returns `{user}` |
| POST | `/api/auth/logout` | Clears the `sid` cookie |
| GET | `/api/auth/me` | Current user (401 when signed out) |
| GET | `/api/cart` | Current cart `{items, subtotal, currency, count}` |
| POST | `/api/cart/items` | `{productId, quantity?, status?}` — upserts the line, broadcasts `cart.updated` |
| PATCH | `/api/cart/items/:productId` | `{quantity?, status?}` — broadcasts `cart.updated` |
| DELETE | `/api/cart/items/:productId` | Remove one line — broadcasts `cart.updated` |
| DELETE | `/api/cart` | Clear cart — broadcasts `cart.updated` |
| GET | `/api/stream` | SSE for the signed-in user. Emits `hello` (snapshot) on connect, then live `cart.updated`, `chat.message`, `chat.tool_call`, `chat.tool_result` events. Heartbeat every 25s. |
| GET | `/api/agent/messages` | Recent chat history. `?limit=30` |
| POST | `/api/agent/chat` | `{message}` — runs the agent loop. Returns the final assistant message; intermediate turns + tool calls broadcast via SSE. Returns 503 if `GROQ_API_KEY` isn't set. |

### `/api/products` query params

- `categoryId`, `vendorId`, `brand`
- `minPrice`, `maxPrice` (integers in paise — see "Pricing")
- `q` whitespace-tokenized substring search across name/description/brand/sku/tags. Tokens are ANDed.
- `sort` one of `newest` (default), `oldest`, `price_asc`, `price_desc`, `rating`
- `limit` (default 20, max 100), `offset` (default 0)

### Response shape

List endpoints return `{ total, limit, offset, results: [...] }`. Single-entity endpoints return the entity directly. Errors look like:

```json
{ "error": "not_found", "message": "Product product:... not found" }
```

## Auth

Cookie-based sessions. `POST /api/auth/login` and `POST /api/auth/register` set an `HttpOnly` `sid` cookie scoped to the API. The browser must send `credentials: "include"` (the React client does this by default). Sessions live in the `sessions` table with a 7-day sliding TTL — every authenticated request bumps `expires_at`.

CORS allows credentials from `FRONTEND_ORIGIN` (default `http://localhost:3000`). Override with the env var if the React app runs elsewhere.

Cookies are scoped to the `sid` name on `localhost:4000`, which means each browser on the same machine has its own session — exactly what we want for the demo (sign in on Chrome and Firefox separately, both work).

## Real-time

`GET /api/stream` is a Server-Sent Events endpoint. Each connection subscribes to its user's pub/sub channel `user:<userId>:events` and forwards events to the client. Events emitted today:

- `hello` — initial snapshot on connect (cart payload)
- `cart.updated` — full cart payload after any mutation
- `chat.message` — new chat turn (user, assistant, or tool result)
- `chat.tool_call` — agent invoked a tool (used to render a "searching…" indicator before the result)
- `chat.tool_result` — same payload as `chat.message` for `role: "tool"`, sent right after the tool runs
- `ui.command` — agent wants the frontend to do something visible: `{action: "navigate"|"click"|"highlight", target?, path?, why?}`. The frontend's `useCursor` store animates a virtual AI cursor to the right `data-ai-target` element.

Pub/sub is backed by Valkey via `iovalkey` (set `VALKEY_URL`, default `redis://localhost:6379`). When Valkey isn't reachable, the bus falls back to an in-process `EventEmitter` so dev still works — multi-device sync degrades to single-process only.

## Agent

`POST /api/agent/chat` runs the shopping agent loop server-side. The client posts a single `{message}` and observes the rest of the turn (assistant message, tool calls, tool results, UI commands) over the existing SSE channel. Set `GROQ_API_KEY` in `backend/.env` to enable; without it the endpoint returns 503 while the rest of the API keeps working.

Default model is `openai/gpt-oss-120b` (handles tool-call grammar more reliably than Llama 3.3 with our 10-tool surface). Override via `GROQ_MODEL`.

Tools shipped today:

**Read-only:**
- `search_products` — full-text search with optional category/price/sort filters. Returns trimmed product summaries with a `priceDisplay` field already formatted as ₹X,XXX so the model never does currency arithmetic.
- `semantic_search` — vector similarity (Valkey-backed embeddings). Use for descriptive/conceptual queries like "something to relax with".
- `get_product` — full details for one product.
- `check_stock` — live `inventoryQuantity - reserved`.

**State / UI ("WebMCP-style"):** each emits a `ui.command` event the frontend's virtual cursor renders, then performs the underlying action.
- `navigate` — route change (allowed paths: `/`, `/shop`, `/cart`, `/account`, `/wishlist`, `/checkout`, `/product-details`).
- `apply_filter` — navigate to `/shop` with `q`/`categoryId`/`minPrice`/`maxPrice`/`sort` query.
- `open_product` — flies cursor to the visible product card, then routes to its detail page.
- `add_to_cart` — flies cursor to the product's Add button, plays click ripple, then mutates the cart server-side. Supports `status="draft"` for tentative picks.
- `remove_from_cart` — flies cursor to the cart row's Remove button, then deletes.
- `set_cart_status` — promote/demote between `active` and `draft`.
- `highlight` — glow ring on a `data-ai-target` element without changing state.

Loop is bounded by `MAX_TOOL_ITERATIONS = 6` in `services/chat.js`. History capped at 30 messages. Cart-mutation ordering: the cursor `click` ripple lands before the actual cart write so the visual causality reads "click → cart updated".

## Semantic search

Vector similarity over the catalog, backed by Valkey.

- Embeddings: `Xenova/all-MiniLM-L6-v2` (384-dim, ~22 MB quantized) via `@huggingface/transformers`. Runs in Node on CPU. First load downloads weights to `~/.cache/huggingface`.
- Build: `npm run seed:embeddings` reads SQLite, embeds every active product (name + brand + tags + descriptions), and writes one Valkey HASH:
  - `embeddings:vectors`  — field=productId, value=base64(Float32 bytes)
  - `embeddings:meta`     — model, dim, count, builtAt
- Query: embed query → load all vectors from Valkey (cached in-memory after first request, invalidated when `meta.builtAt` changes) → cosine similarity (vectors are L2-normalized at embed time, so a plain dot product *is* the cosine) → join top K with SQLite for full product data.
- This is in-memory cosine for now (~30 products). The same callsite (`semanticSearch.search()`) will swap to `FT.SEARCH ... =>[KNN ...]` once the Search module ships — no API changes.

The `semantic_search` agent tool wraps the same service. The agent picks it on its own for descriptive queries ("something to relax with", "minimalist gift").

## Data model

IDs follow `domain:uuidv7` from `HACKATHON.md`. Tables:

- `categories(id, name, slug, icon, parent_id)`
- `vendors(id, name, slug, email, phone, logo, rating, address, verified, joined_at)`
- `products(id, sku, name, slug, description, short_description, category_id, vendor_id, brand, price_*, attributes, tags, images, inventory_*, ratings_*, status, created_at, updated_at)`
- `users(id, email, password_hash, first_name, last_name, role, created_at, last_login_at)`
- `sessions(id, user_id, created_at, expires_at, last_seen_at)`
- `cart_items(user_id, product_id, quantity, status, added_at, updated_at)` — composite PK `(user_id, product_id)`. `status` is `"active"` or `"draft"` (the agent will use `draft` later).
- `chat_messages(id, user_id, role, content, tool_calls, tool_call_id, tool_name, created_at)` — full agent transcript per user. `tool_calls` is a JSON-encoded array of OpenAI/Groq tool-call objects so we can re-feed the model on the next turn without rebuilding from scratch.

`attributes`, `tags`, `images`, and vendor `address` are stored as JSON strings and parsed back into objects/arrays in responses (`src/lib/serializers.js`).

## Pricing

`price.amount` and `price.compareAt` are integers in **paise** (₹89,999.00 = `8999900`), matching the HACKATHON.md contract. The frontend should divide by 100 for display.

## Seed contents

`npm run seed` creates:

- 4 top-level categories with 2–3 leaf children each (10 leaf categories)
- 4 vendors
- 3–4 products per leaf category (~32 products total)

Sample IDs (yours will differ — UUIDv7s are time-based):

```
category:0192...   product:0192...   vendor:0192...
```

## Migration path to Valkey

The route handlers and serializers are deliberately thin. To switch to Valkey:

1. Replace `src/db.js` with a Valkey client (e.g. `iovalkey` or `valkey-glide`).
2. Store products as JSON documents with `JSON.SET product:<id> $ '{...}'` — the serializer output is already the correct shape.
3. Build secondary indexes per `HACKATHON.md` (sorted sets for category/price, `FT.CREATE` for search, etc.).

The frontend contract (URLs, query params, response shapes) does not change.
