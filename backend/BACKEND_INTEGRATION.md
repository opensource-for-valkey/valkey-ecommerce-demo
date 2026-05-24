# Backend Integration Guide — Agentic Search

Real backend (Node + Express + Valkey) that powers the React frontend **and**
the agentic-search system from a single catalog. No mocks; every endpoint reads
from Valkey indexes.

---

## 1. Quick start

```bash
cd backend
npm install

# Valkey (Redis-compatible). Skip if you already have one running on :6379.
docker run -d --name valkey -p 6379:6379 valkey/valkey:7.2

cp .env.example .env        # optional GEMINI_API_KEY
npm run seed                # loads 42 products + indexes into Valkey
npm run dev                 # http://localhost:4000
```

Health check:

```bash
curl http://localhost:4000/health
# → {"status":"ok","valkey":"up","jsonModule":true,"gemini":true,...}
```

---

## 2. Architecture

```
React UI ──► /api/products …            ──┐
React UI ──► /api/agent/search          ──┤
                                          ├─► catalog.service.js ──► Valkey
agent tools (search_products, find_similar, get_product_details, check_availability)
```

`services/catalog.service.js` is the **single source of truth** for catalog
logic. Both the REST routes and the agent tools call into it, so the agent and
the UI can never disagree on what's in stock or what matches a filter.

---

## 3. Valkey data model

| Key                                | Type   | Purpose                                                |
| ---------------------------------- | ------ | ------------------------------------------------------ |
| `product:<id>`                     | JSON   | Full product document                                  |
| `index:products`                   | SET    | All product ids (`product:00000001` …)                 |
| `index:categories`                 | SET    | All category slugs                                     |
| `category:<slug>`                  | SET    | Product ids in a category                              |
| `category-meta:<slug>`             | JSON   | `{slug,label,icon}`                                    |
| `brand:<slug>`                     | SET    | Product ids for a brand                                |
| `index:brands`                     | SET    | All brand slugs                                        |
| `products:price`                   | ZSET   | Global price index (score = price)                     |
| `products:price:<slug>`            | ZSET   | Per-category price index → `ZRANGEBYSCORE` filters     |
| `products:rating`                  | ZSET   | Global rating index                                    |
| `products:rating:<slug>`           | ZSET   | Per-category rating index                              |
| `index:stock`                      | HASH   | Live stock count per product id                        |
| `index:stock:low`                  | SET    | Product ids with stock ≤ 5                             |
| `trending:global:1h` / `:all`      | ZSET   | Hot-product leaderboard, score = views + seed rating   |
| `trending:category:<slug>:1h`      | ZSET   | Per-category trending                                  |
| `trending:views`                   | HASH   | Lifetime view count (per product id)                   |
| `index:embeddings`                 | HASH   | productId → 8-dim toy embedding for semantic search    |
| `conversation:<sessionId>`         | JSON   | Agent conversation state                               |
| `agent_cache:<hash>`               | STRING | Per-tool cached agent results (TTL 300s)               |
| `api_cache:<hash>`                 | STRING | Per-API query result cache (TTL 300s)                  |
| `user_preferences:<userId>`        | JSON   | User personalization profile                           |
| `feedback:<sessionId>`             | LIST   | Up/down feedback per session                           |

### Example product document

```json
{
  "productId": "product:00000038",
  "id": "product:00000038",
  "name": "Sony WH-1000XM5 Wireless",
  "slug": "sony-wh-1000xm5-wireless",
  "category": "headphone",
  "brand": "Sony",
  "vendor": "Lucky Supermarket",
  "price": 349,
  "originalPrice": 399,
  "currency": "USD",
  "unit": "/Qty",
  "rating": 4.8,
  "reviewCount": 21000,
  "stock": 45,
  "inStock": true,
  "color": "Black",
  "ageGroup": "adult",
  "tags": ["headphone","wireless","noise-cancel","premium","audio"],
  "image": "assets/images/thumbs/product-img15.png",
  "images": ["assets/images/thumbs/product-img15.png", "..."],
  "description": "Industry-leading noise canceling headphones with 30-hour battery.",
  "highlights": ["Class-leading ANC","30h battery","Multipoint"],
  "embedding": [0,0.8,0,0,1,0.3,0,1]
}
```

---

## 4. API reference

All endpoints return JSON, never block longer than ~1s on cache miss, and ~50ms
on cache hit.

### 4.1 `GET /api/categories`
Returns the canonical category list that the frontend sidebar should render.

```bash
curl http://localhost:4000/api/categories
```
```json
{
  "items": [
    {"slug":"mobile-accessories","label":"Mobile & Accessories","icon":"ph-device-mobile"},
    {"slug":"laptop","label":"Laptop","icon":"ph-laptop"},
    {"slug":"headphone","label":"Headphone","icon":"ph-headphones"}
  ]
}
```

### 4.2 `GET /api/products`
List / filter / sort / paginate.

Query params:

| Param      | Notes                                                          |
| ---------- | -------------------------------------------------------------- |
| `q`        | Free text — matched against name, description, tags, brand     |
| `category` | Category slug (see `/api/categories`)                          |
| `brand`    | Brand name or slug                                             |
| `color`    | One of Black/Blue/Gray/Green/Red/White/Purple                  |
| `minPrice` / `maxPrice` | Numeric, USD                                      |
| `minRating`| Numeric                                                        |
| `tags`     | CSV: `tags=wireless,premium`                                   |
| `inStock`  | `true` to filter sold-out                                      |
| `sort`     | `relevance` (default), `price-asc`, `price-desc`, `rating`, `newest` |
| `page`     | 1-indexed                                                      |
| `pageSize` | Default 24, max 60                                             |

```bash
curl "http://localhost:4000/api/products?category=headphone&maxPrice=300&sort=price-asc&pageSize=5"
```
```json
{
  "items": [
    {"productId":"product:00000041","name":"JBL Tune 510BT Wireless","price":39.99,"rating":4.4, ...},
    {"productId":"product:00000042","name":"Sennheiser HD 560S Open-Back","price":199.99, ...},
    {"productId":"product:00000039","name":"Apple AirPods Pro 2 USB-C","price":249, ...}
  ],
  "total": 3,
  "page": 1,
  "pageSize": 5,
  "pages": 1,
  "facets": {
    "brands": {"JBL":1, "Sennheiser":1, "Apple":1},
    "categories": {"headphone":3},
    "colors": {"Blue":1,"Black":1,"White":1},
    "priceRange": {"min":39.99, "max":249}
  }
}
```

### 4.3 `GET /api/products/:id`
Product detail. `:id` accepts both `product:00000038` and just `00000038`.
Fires a trending bump in the background.

```bash
curl http://localhost:4000/api/products/00000038
```

### 4.4 `GET /api/search`
Same shape as `/api/products`. Exposed under a friendlier name for the agent's
fallback path and for direct UI use ("`/search?q=`...").

### 4.5 `GET /api/products/:id/similar`
Tag + brand + price-distance similarity, scoped to the same category.

```bash
curl http://localhost:4000/api/products/00000038/similar?limit=4
```

### 4.6 `GET /api/products/trending`
ZRANGEBYSCORE on `trending:global:<window>`.

Query params: `category`, `limit` (≤ 50), `window` (`1h`|`all`).

```bash
curl "http://localhost:4000/api/products/trending?limit=5"
```

### 4.7 `POST /api/admin/seed`
Idempotent re-seed of Valkey from `src/data/products.js`. Use this in a demo
reset script or after editing the catalog.

### 4.8 `POST /api/admin/stock/tick`  *(bonus)*
Randomly nudges stock counts by ±3 for ~15% of the catalog. Wire to a
`setInterval` in the UI for a live-inventory demo feel.

```bash
curl -X POST http://localhost:4000/api/admin/stock/tick
# → {"ok":true,"changes":[{"productId":"product:00000034","prev":19,"next":17}, …]}
```

---

## 5. Agentic Search APIs (unchanged)

The agent system continues to live at `/api/agent`.

### 5.1 `POST /api/agent/search`

```json
{
  "sessionId": "web_1717…",      // any string; create one client-side and reuse
  "userId":   "user:demo",        // optional, enables preference biasing
  "message":  "wireless headphones under 300"
}
```

Response:

```json
{
  "sessionId": "web_1717…",
  "response":  "Cheaper options under $300 …",
  "results": [
    {
      "productId": "product:00000039",
      "name": "Apple AirPods Pro 2 USB-C",
      "price": 249,
      "rating": 4.8,
      "category": "headphone",
      "tags": ["headphone","wireless","earbuds","premium","audio"],
      "description": "…",
      "reason": "matches your interests: headphone, wireless · fits your budget ($249)"
    }
  ],
  "followUp": "Want me to show cheaper alternatives, premium picks, or filter to a specific category?",
  "context":  { "intent":"refine_budget", "categories":["headphone"], "tags":["wireless"], "maxPrice":300, ... },
  "debug":    { "ms": 612, "toolPlan":[{"tool":"search_products","reason":"…"}], "cacheHits":1 }
}
```

The agent tools all delegate to `catalog.service.js`:

| Agent tool             | Backed by               | UI equivalent                    |
| ---------------------- | ----------------------- | -------------------------------- |
| `search_products`      | `catalog.queryProducts` | `GET /api/search`                |
| `find_similar`         | `catalog.similar`       | `GET /api/products/:id/similar`  |
| `get_product_details`  | `catalog.getProduct`    | `GET /api/products/:id`          |
| `check_availability`   | `catalog.getProduct`    | `GET /api/products/:id` (stock)  |
| `semantic_search`      | toy embeddings + cosine | (no REST surface)                |

### 5.2 Session handling

The client should:

1. Mint one `sessionId` per browser/tab (e.g. `crypto.randomUUID()`) and reuse it for every `/api/agent/*` call.
2. Pass `userId` if available (logged-in user) so the agent can read `user_preferences:<userId>`.
3. Treat `context.lastProductIds` as the "anchor" set — useful when the user says *"find similar"*.

State lives in Valkey (`conversation:<sessionId>`) and expires after `CONVERSATION_TTL` seconds (default 1800).

### 5.3 Conversation utilities

| Method | Path                                | Purpose                                |
| ------ | ----------------------------------- | -------------------------------------- |
| GET    | `/api/agent/conversation/:sid`      | Inspect history                        |
| DELETE | `/api/agent/conversation/:sid`      | Reset state for a session              |
| POST   | `/api/agent/feedback`               | Send up/down on results — see below    |

```json
POST /api/agent/feedback
{ "sessionId":"web_…", "productIds":["product:00000039"], "sentiment":"up", "note":"perfect" }
```

---

## 6. Replacing hardcoded frontend data

The React UI today renders products from inline JSX. Below is the swap-in
pattern for each page. Backend response shapes are designed to match the
existing render code 1:1 — only field names change.

### Card components (`NewArrivalOne`, `PopularProductsOne`, …)

```js
const [items, setItems] = useState([]);
useEffect(() => {
  fetch(`${API}/api/products?sort=newest&pageSize=8`)
    .then(r => r.json())
    .then(d => setItems(d.items));
}, []);
```

Then in JSX, map fields:

| UI field            | API field           |
| ------------------- | ------------------- |
| product image       | `image`             |
| product name        | `name`              |
| rating              | `rating`            |
| review count        | `reviewCount`       |
| vendor              | `vendor`            |
| strike-through old  | `originalPrice`     |
| current price       | `price`             |
| unit suffix `/Qty`  | `unit`              |
| detail link         | `/product/${id.replace('product:','')}` |

### Category sidebar (`ShopSection`)

```js
useEffect(() => {
  fetch(`${API}/api/categories`).then(r => r.json()).then(d => setCats(d.items));
}, []);
// render { item.label } ({ counts[item.slug] || 0 })
```

To get per-category counts in the sidebar, hit `/api/products?category=<slug>&pageSize=1`
and read `total` — small and cached.

### Product detail page (`ProductDetailsOne`)

```js
const { id } = useParams();
useEffect(() => {
  fetch(`${API}/api/products/${id}`).then(r => r.json()).then(setProduct);
}, [id]);

// "Similar items" carousel
useEffect(() => {
  fetch(`${API}/api/products/${id}/similar`).then(r => r.json()).then(d => setSimilar(d.items));
}, [id]);
```

### Search bar

Already wired in this repo to `/api/agent/search`. See `frontend/src/pages/SearchResultsPage.jsx`.

---

## 7. Performance + caching

* Per-API cache: every `/api/products` query is hashed and cached in `api_cache:<hash>` for 300s.
* Per-tool cache: each agent tool result is cached in `agent_cache:<tool>:<hash>` for 300s.
* In-process product cache: 30s memo on `getAllProducts()` to avoid hammering Valkey when many concurrent queries hit cold cache.
* Indexes (price ZSET, category SET, brand SET) let common filters resolve in O(log N + K) instead of full scans.

Measured cold-cache: ~80–200ms per `/api/products` request. Warm: <10ms.

---

## 8. Hackathon wow features

* **Dynamic trending** — `GET /api/products/:id` fires a non-blocking `ZINCRBY` on `trending:global:1h`, so the "trending now" carousel reorders itself as users browse.
* **Fake stock changes** — `POST /api/admin/stock/tick` jiggles ~15% of products. Wire to a setInterval on the homepage to demo live inventory.
* **Personalized recs** — `user_preferences:<userId>` is read by the agent planner; pass `userId: "user:demo"` to `/api/agent/search` to see category-biased results.
* **Caching everywhere** — every query is cache-hashed; repeated agent / API requests return in <10ms.

---

## 9. Frontend env

Set in `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:4000/api/agent
REACT_APP_CATALOG_URL=http://localhost:4000/api
```

`SearchResultsPage.jsx` reads the first. Card components should read the second.

---

## 10. Troubleshooting

| Symptom                              | Fix                                                        |
| ------------------------------------ | ---------------------------------------------------------- |
| `valkey: down` on `/health`          | Start Valkey (`docker run …`) or check `VALKEY_URL`        |
| Empty `/api/products` results        | Run `npm run seed` (also via `POST /api/admin/seed`)       |
| Stale agent answers                  | `redis-cli DEL "agent_cache:*"` or restart server          |
| Frontend can't reach backend         | Confirm CORS — server.js opens `cors({origin:true})`       |
