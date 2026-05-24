# CLAUDE.md

Guide for Claude / agents working in this repo. Read this before making changes.

## What this project is

A **hackathon starter** for the *Build Beyond Limits* hackathon (powered by Valkey, hosted by React Hyderabad). It ships a fully-themed **React e-commerce frontend** that teams extend by building **Valkey-powered backend services** (auth, search, cart, recommendations, etc.).
link : https://github.com/opensource-for-valkey/valkey-ecommerce-demo

- The frontend is **static/mock-only today**. There are no API calls, no fetches, no backend code in this repo. All product/vendor/blog content is hardcoded in JSX.
- The repo defines **strict data and infrastructure contracts** in `HACKATHON.md` that backend implementations must follow so frontend and backend teams can work in parallel.
- `Valkey-Integrations.md` is a separate inventory of upstream OSS projects that could integrate Valkey. It is **reference material**, not part of this app.

## Repository layout

```
valkey-ecommerce-demo/
├── README.md               # Setup, scripts, project overview
├── HACKATHON.md            # 14 challenge subsystems + data contracts (READ THIS)
├── Valkey-Integrations.md  # External reference, unrelated to this app
├── documentation/          # Static HTML docs site (template, not the React app)
├── backend/                # Node.js + SQLite REST API (placeholder for Valkey)
│   ├── package.json        # start / dev / seed / reset scripts
│   ├── data/               # SQLite file lives here (gitignored)
│   └── src/
│       ├── index.js        # Express app + 404/error handlers
│       ├── db.js           # better-sqlite3 connection + schema
│       ├── seed.js         # Wipes + seeds categories/vendors/products
│       ├── lib/
│       │   ├── id.js       # createId('product') -> 'product:<uuidv7>'
│       │   └── serializers.js  # snake_case rows -> HACKATHON.md camelCase
│       └── routes/         # products, categories, vendors
└── frontend/               # The React app
    ├── package.json
    ├── public/
    │   ├── assets/         # Theme CSS/JS/SCSS/images served as-is
    │   ├── .htaccess
    │   └── _redirects
    └── src/
        ├── App.js          # All routes (BrowserRouter)
        ├── index.js        # Entry, imports bootstrap + select2 + global SCSS
        ├── index.scss      # Imports public/assets/sass/main.scss
        ├── api/            # Backend client (client.js, useFetch.js, format.js)
        ├── components/     # ~70 flat .jsx files (see "Component conventions")
        │   └── common/     # Cross-cutting reusable pieces (ProductCard, ...)
        ├── helper/         # Animation, Preloader, ColorInit, RouteScrollToTop, etc.
        └── pages/          # Page-level components mounted by App.js
```

`documentation/` is a separate static landing page (Bootstrap + jQuery template). Don't confuse it with the React app.

## Tech stack

**Frontend (in this repo):**
- React 18 + Create React App (`react-scripts 5.0.1`)
- React Router v6
- Bootstrap 5, custom SCSS in `public/assets/sass/main.scss`
- jQuery + select2 (used inside React components — see "Gotchas")
- Slick carousel, AOS, animate.css, wowjs, isotope-layout
- Phosphor Icons (`@phosphor-icons/react`)
- Jest + React Testing Library (CRA defaults)

**Backend (in this repo, placeholder for Valkey):**
- Node.js + Express 4
- `better-sqlite3` (synchronous, file at `backend/data/app.db`)
- `iovalkey` for Valkey commands + pub/sub (two connections; the second one is dedicated to subscriptions). Falls back to in-process `EventEmitter` when Valkey is unreachable.
- `groq-sdk` for the shopping agent (model: `llama-3.3-70b-versatile`, configurable). Server reads `GROQ_API_KEY` from `backend/.env` via `dotenv`. The agent is gated behind that key — without it, `/api/agent/chat` returns 503 but everything else keeps working.
- `bcryptjs` for password hashing, `cookie-parser` for the session cookie, `zod` for input validation
- `uuid` v7 for `domain:uuidv7` IDs (HACKATHON contract)
- `cors` enabled for the React dev server (`credentials: true`, origin from `FRONTEND_ORIGIN`)
- This will be replaced by Valkey later. Response shapes already match the
  HACKATHON contract so the swap is a backend-only change.

**Future backend (to be built by hackathon teams):**
- Valkey via the `valkey/valkey-bundle:9-alpine` Docker image (Search, JSON, Bloom, etc.)
- Default connection: `redis://localhost:6379`

## Commands

Run frontend commands from `frontend/`, backend commands from `backend/`.

### Frontend

| Command | What it does |
|---|---|
| `npm install` | Install deps |
| `npm start` | Dev server on http://localhost:3000 (don't run via background tooling — long-running) |
| `CI=true npm test` | Run tests once |
| `CI=true npm test -- --coverage` | Tests with coverage |
| `npm run build` | Production build to `frontend/build/` |

### Backend

| Command | What it does |
|---|---|
| `npm install` | Install deps |
| `npm run seed` | Wipes + seeds `data/app.db` with categories, vendors, products |
| `npm start` | API on http://localhost:4000 |
| `npm run dev` | Same as start with `node --watch` |
| `npm run reset` | Delete the DB file and re-seed |

### Other

| Command | What it does |
|---|---|
| `docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:9-alpine` | Start Valkey locally (when teams begin migrating) |
| `docker exec -it valkey valkey-cli` | Open Valkey CLI |

Tests today are essentially the CRA default (`App.test.js`). When adding logic, add tests next to the unit under test using RTL.

## Routing map (App.js)

```
/                     → HomePageOne
/index-two            → HomePageTwo
/index-three          → HomePageThree
/shop                 → ShopPage
/product-details      → ProductDetailsPageOne
/product-details-two  → ProductDetailsPageTwo
/cart                 → CartPage
/checkout             → CheckoutPage
/become-seller        → BecomeSellerPage
/wishlist             → WishlistPage
/account              → AccountPage
/blog                 → BlogPage
/blog-details         → BlogDetailsPage
/contact              → ContactPage
/vendor               → VendorPage
/vendor-details       → VendorDetailsPage
/vendor-two           → VendorTwoPage
/vendor-two-details   → VendorTwoDetailsPage
```

`RouteScrollToTop` and `PhosphorIconInit` are mounted globally inside `BrowserRouter`.

## Component conventions

- `components/` is **flat** (no subfolders) for the legacy theme components. New cross-cutting components live in `components/common/` (e.g. `ProductCard`).
- Multiple **layout variants** coexist using `One` / `Two` / `Three` suffixes (e.g. `HeaderOne`, `HeaderTwo`, `BannerOne`, `BannerThree`). `One` is the canonical variant used by `HomePageOne`. Match the variant to the page you're modifying.
- Pages compose components in a fixed visual order. They start with `<Preloader />`, `<ScrollToTop />`, `<ColorInit />`, then the appropriate `Header*`, sections, `Footer*`, `BottomFooter`.
- Most components still have hardcoded sample content. The product surfaces wired to the API are: `ProductListOne` (home), `ShopSection` (`/shop`), `ProductDetailsOne` (`/product-details`). Other variants and the rest of the components remain mock data until needed.

## Data flow (frontend ↔ backend)

- `src/api/client.js` exposes a thin REST client. Base URL comes from `REACT_APP_API_URL`, defaulting to `http://localhost:4000`. All calls run with `credentials: "include"` so the session cookie travels.
- `src/store/auth.js` (Zustand) holds the current user and runs an initial `/api/auth/me` probe in `index.js` so headers/cart know auth state on first paint. Exposes `login`, `register`, `logout`.
- `src/store/cart.js` (Zustand) mirrors the cart payload from the API and exposes `refresh`, `addItem`, `updateItem`, `removeItem`, `clear`. Subscribes to the auth store so it auto-refreshes on sign-in and resets on sign-out.
- `src/store/stream.js` opens an `EventSource` to `/api/stream` once the user is signed in, applies `hello` and `cart.updated` events to the cart store, and reconnects with exponential backoff. Mounted via `useStream()` in `App.js`.
- `src/api/useFetch.js` is a small `{data, error, loading}` hook for read-only endpoints.
- `src/api/format.js` has display helpers — `formatPrice` (paise → `Intl.NumberFormat` INR string), `productThumbnail` (with theme-asset fallback), `ratingLabel`.
- `src/components/common/ProductCard.jsx` renders the two card layouts (`compact` for the home rail, `shop` for the /shop grid + list). The "Add" button calls `cart.addItem`; if signed out, it bounces to `/account`.
- `src/components/common/SearchSuggestions.jsx` is a debounced autocomplete dropdown that hits `/api/search/suggest`.
- Header search forms navigate to `/shop?q=...`. `ShopSection` reads `q` from `useSearchParams` and forwards it. The cart badge in both headers reads `useCart().count`.
- Product detail uses `?id=product:<uuidv7>` query params (`useSearchParams`). Cards link to `/product-details?id=...`.

## Real-time (Phase 2)

- Backend: `lib/valkey.js` boots two iovalkey connections. `lib/bus.js` exposes `publish(channel, event)` and `subscribe(channel, fn)`. When Valkey is unreachable it transparently falls back to a process-local `EventEmitter` so the dev server still runs.
- Channel format follows HACKATHON.md naming: `user:<userId>:events`.
- Every cart mutation publishes a `cart.updated` event with the full new payload; the SSE endpoint forwards it to all of that user's connected clients.
- `GET /api/stream` is an SSE endpoint guarded by `requireAuth`. Sends a `hello` snapshot on connect (so a freshly-opened tab has the right cart immediately) and then live events. Heartbeat every 25s.
- Frontend uses native `EventSource` with `withCredentials: true`. The bus refcounts subscriptions so multiple tabs of the same user share a single Valkey subscription.
- To test multi-device: log in on Chrome, log in on Firefox with the same account, add to cart from one — the other updates in <100ms.

## Agent (Phase 3+4)

- Groq client: `lib/groq.js`. Default model `openai/gpt-oss-120b` (override with `GROQ_MODEL`). `temperature: 0.2` for stable tool-call grammar. Reads `GROQ_API_KEY` from `backend/.env` (gitignored).
- Tool registry: `services/tools.js`.
  - Read-only: `search_products`, `get_product`, `check_stock`. Each result includes a `priceDisplay` string formatted as ₹X,XXX so the model never does paise→rupee math.
  - WebMCP-style action tools (Phase 4): `navigate`, `apply_filter`, `open_product`, `add_to_cart`, `remove_from_cart`, `set_cart_status`, `highlight`. Each emits a `ui.command` over the user's pub/sub channel before mutating server state.
- Agent loop: `services/chat.js`. Persists every turn to `chat_messages` and broadcasts each turn over the same pub/sub channel as cart events. Loop is capped at 6 tool iterations. Catches Groq's `tool_use_failed` and falls back to a no-tools completion so a malformed call doesn't crash the turn.
- Cart mutations from agent and REST go through the shared `services/cartOps.js` so both paths emit the same `cart.updated` broadcast.

## Semantic search (Phase 5)

Vector similarity over the product catalog, with embeddings stored in Valkey.

- **Model**: `Xenova/all-MiniLM-L6-v2` (384-dim, ~22 MB quantized) via `@huggingface/transformers`. Runs on CPU in Node — no GPU, no external API. First load downloads to `~/.cache/huggingface`; cached after that.
- **Build**: `cd backend && npm run seed:embeddings` reads every active product from SQLite, embeds (name + brand + tags + descriptions), and writes a single Valkey HASH `embeddings:vectors` (field = productId, value = base64 of Float32 bytes), plus `embeddings:meta` (model, dim, count, builtAt).
- **Query**: embed the query → load all vectors from Valkey (cached in-memory, invalidated on `meta.builtAt` change) → cosine via dot product (vectors are L2-normalized at embed time) → top K join with SQLite for full product data → return shaped results matching the rest of the API.
- **Endpoints**: `GET /api/search/semantic?q=&k=&categoryId=&minPrice=&maxPrice=` for direct frontend use; `semantic_search` agent tool wraps the same service.

Cosine over ~30 vectors is microseconds in JS, so we keep it in-memory for now. When we flip on the Valkey Search module, `services/semanticSearch.js` swaps to `FT.SEARCH ... =>[KNN ...]` and nothing else moves.

## Virtual AI cursor (Phase 4 frontend)

- `store/cursor.js` is a Zustand store + a small command queue. Receives `ui.command` events from the SSE channel and plays them in order: smooth flight (~700ms) to a `[data-ai-target=...]` element, then a "click" ripple or "highlight" glow.
- `components/common/AICursor.jsx` renders the cursor SVG and a small label bubble ("Adding Yoga Mat to your cart"). Inline CSS keyframes scoped via a single `<style>` tag.
- `components/common/CursorBridge.jsx` translates `navigate` cursor commands into `useNavigate()` calls (must live inside `<BrowserRouter>`).
- `data-ai-target` attribute conventions:
  - `product-card:<productId>` — the card itself
  - `product-card-add:<productId>` — the Add-to-Cart button
  - `cart-remove:<productId>` — the Remove button on the cart row
  - `header-cart` — the cart icon in either header
- Important: agent-initiated clicks are visual only by default. They only forward a real DOM click if the target opts in via `data-ai-clickable="true"` — otherwise the underlying state mutation already happened server-side and we'd double-mutate.
- Cart mutations from the agent are timed so the cursor click ripple lands ~700ms before the cart actually updates, so the visual causality reads correctly.

## Gotchas to watch for

1. **jQuery inside React.** Components like `HeaderOne` initialize `select2` via jQuery in `useEffect`. When refactoring, preserve the cleanup (`select2("destroy")`) to avoid leaks. Prefer not to introduce new jQuery; if the user wants to migrate, flag the scope.
2. **Global SCSS path.** `index.scss` imports `~/public/assets/sass/main.scss` via the leading `/public/...` syntax. CRA resolves this through webpack — don't move the file without updating the import.
3. **Bootstrap JS bundle** is imported globally in `index.js` (`bootstrap.bundle.min`). Modal/dropdown/collapse markup expects this.
4. **Static assets** live under `frontend/public/assets/` and are referenced as absolute paths like `/assets/...` in JSX. Don't move them into `src/`.
5. **Variants are not interchangeable.** `HeaderOne` and `HeaderTwo` have different markup, classes, and dependencies. Don't generalize them without checking every page that imports them.
6. **No state management library.** No Redux/Zustand/Context for cart/auth. The frontend reads from the API via `useFetch`; nothing is cached or shared across components. When wiring a backend feature that needs cross-page state (cart, auth), introduce a state library deliberately and document the choice.
7. **API client lives at `src/api/`.** Don't sprinkle `fetch` calls in components — go through `api.client`. Use `REACT_APP_API_URL` to point the frontend at a different backend.
8. **Long-running commands.** `npm start` and `npm test` (watch mode) block. Always run tests as `CI=true npm test`. For the dev server, ask the user to run it manually.
9. **No TypeScript.** This is plain JavaScript with JSX. Don't add `.ts`/`.tsx` ad hoc — discuss before introducing TS.

## Backend integration contract (when extending the app)

`HACKATHON.md` is the source of truth. Key rules to honor in any frontend/backend code you write:

### ID format

All entity IDs are `domain:uuidv7`:

```
user:0192d4e0-7b3a-7f5c-9e1a-4b8c2d6f0a1e
product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f
order:0192d4e8-5e6f-7c8d-8a0b-2c3d4e5f6a7b
category:..., vendor:..., addr:..., ad:..., session:...
```

UUIDv7 is time-sortable, so the ID itself doubles as a chronological index. Generate with `uuid` v9+ (`import { v7 as uuidv7 } from 'uuid'`).

### Valkey key naming

- **Primary entities use the ID as the key directly**: `JSON.SET product:0192d4e6-... $ '{...}'`.
- **Derived structures** use `{purpose}:{entityId}` or `{purpose}:{qualifier}`:
  - `cart:user:<userId>`
  - `session:<sessionToken>`
  - `trending:global:1h`, `trending:category:<categoryId>:1h`
  - `ratelimit:user:<userId>:<endpoint>:<windowTs>`
  - `copurchase:<productId>`, `user_affinity:<userId>`

### Performance targets

| Operation | Target |
|---|---|
| Key-value read | < 1ms |
| JSON document read | < 5ms |
| Full-text search | < 10ms |
| Vector search (10K docs) | < 10ms |
| Geospatial query | < 5ms |
| Rate limit check | < 2ms |

### Standard error response

```json
{ "error": "error_code", "message": "Human-readable description", "details": {} }
```

### Challenge areas (subsystems)

`HACKATHON.md` details all 14. Quick index of which Valkey primitives each one uses:

| # | Subsystem | Primary Valkey features |
|---|---|---|
| 1 | Authentication | `JSON.SET` user, `SET session:<token> EX`, `INCR` failed-login counter |
| 2 | Catalog | `JSON.SET`/`JSON.GET`, sorted-set indexes by category/price, `SADD` brand index |
| 3 | Cart + Coupons | Hash for cart, `JSON.SET coupon:<code>`, `SADD coupon_used:<code>` |
| 4 | Trending | `ZINCRBY trending:*` with weighted scoring, time-bucketed keys with TTL |
| 5 | Ads | `JSON.SET ad:<id>`, `ZADD ads:category:<id>` by bid, daily budget counters |
| 6 | Full-text Search | `FT.CREATE idx:products ON JSON`, `FT.SEARCH`, `FT.AGGREGATE`, `FT.SUGADD` |
| 7 | Vector Search | `FT.CREATE` with `VECTOR HNSW`, `KNN` queries, hybrid filters |
| 8 | Analytics / Prometheus | `INCR`/`INCRBY` time buckets, sorted-set latency, `PFADD` HLL, hash gauges |
| 9 | Observability / OpenSearch | `XADD logs:app`, consumer groups, error `ZINCRBY`, trace `JSON.SET` |
| 10 | Checkout / Inventory | Lua reserve script on `JSON.NUMINCRBY`, `SET reservation:* EX`, idempotency keys |
| 11 | Delivery | `GEOADD`/`GEOSEARCH`, `JSON.SET tracking:<id>`, `PUBLISH delivery:location:*` |
| 12 | Rate Limiting | Fixed window `INCR`, sliding window sorted set, token bucket Lua |
| 13 | Recommendations | `LPUSH` history, `ZINCRBY copurchase:*`, `ZUNIONSTORE` blended scoring |
| 14 | Agentic Search | `JSON.SET conversation:<sessionId>`, intent vector index, tool-result cache |

When implementing any of these, copy the exact data shapes from `HACKATHON.md` so frontend mocks and backend responses stay aligned.

## Working style for this repo

- **Default to small, surgical edits.** The components are theme-heavy and visually coupled to the SCSS. Aggressive refactors break the layout.
- **Match the existing variant.** If touching a `One` component, leave `Two`/`Three` alone unless the user asks.
- **Don't add tests unless asked.** Follow the global rule.
- **Don't introduce TypeScript, a state library, or a new CSS framework** without checking with the user first.
- **Treat `HACKATHON.md` IDs and key names as authoritative.** If a user proposes a variant, point them at the contract before deviating.
- **Verify with `npm run build`** after non-trivial JSX/SCSS changes, since CRA's webpack catches more than `npm start` HMR does.
