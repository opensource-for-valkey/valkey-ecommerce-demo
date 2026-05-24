# Integrated Valkey E-Commerce Backend

This backend implements the unified Challenges 1-14 demo API for the Valkey e-commerce app. It uses Valkey JSON for users, products, categories, vendors, coupons, ads, delivery tracking, conversations, and orders; expiring Valkey keys and sorted sets for sessions; Valkey hashes for carts; BullMQ queues backed by Valkey; Valkey Search/Vector Search for product search; Lua scripts for atomic inventory mutation; Valkey geospatial indexes for delivery; Valkey sorted sets for trending, ads, recommendations, and rate limits; Valkey-backed metrics for Prometheus; and Valkey Streams as the durable OpenSearch log buffer.

## Run Locally

Start the required services from the repository root:

```bash
docker compose up -d valkey opensearch embeddings
```

Install, seed, and run the backend:

```bash
cd backend/checkout
npm ci
npm run seed
npm run dev
```

The service listens on `http://localhost:4000` by default.

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| `VALKEY_URL` | unset | Full Valkey connection URL. Takes precedence over host/port fields. |
| `VALKEY_HOST` | `localhost` | Valkey host when `VALKEY_URL` is unset. |
| `VALKEY_PORT` | `6379` | Valkey port when `VALKEY_URL` is unset. |
| `VALKEY_USERNAME` | unset | Optional ACL username. |
| `VALKEY_PASSWORD` | unset | Optional ACL password. |
| `VALKEY_TLS` | `false` | Enables TLS options when set to `true`. |
| `CHECKOUT_PORT` | `4000` | HTTP server port. |
| `CHECKOUT_WORKER_CONCURRENCY` | `4` | Worker concurrency per queue. |
| `RESERVATION_TTL_SECONDS` | `600` | Inventory reservation expiry. |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin. |
| `EMBEDDING_SERVICE_URL` | `http://localhost:8001` | FastAPI embedding service URL. |
| `OPENSEARCH_URL` | `http://localhost:9200` | OpenSearch URL for log forwarding. |
| `OPENSEARCH_INDEX` | `valkey-ecommerce-logs` | OpenSearch index name. |
| `AUTH_SESSION_TTL_SECONDS` | `86400` | Valkey session key TTL. |
| `AUTH_BCRYPT_ROUNDS` | `12` | bcrypt password hashing rounds. |
| `RATE_LIMIT_ENABLED` | `true` | Enables the Valkey sliding-window API rate limiter. |

## API

Catalog, search, cart, metrics, and observability endpoints are public for the demo. Authenticated endpoints accept `Authorization: Bearer <session-token>`. Checkout and order endpoints also keep `X-User-Id` as a demo fallback; side-effecting checkout steps require `Idempotency-Key`.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a user JSON document, bcrypt password hash, and expiring Valkey session. |
| `POST` | `/api/auth/login` | Authenticate with failed-attempt rate limiting in Valkey. |
| `POST` | `/api/auth/logout` | Delete the active session key. |
| `GET` | `/api/auth/me` | Fetch the current public user. |
| `POST` | `/api/auth/refresh` | Refresh the session TTL. |
| `GET` | `/api/products` | List active products from Valkey JSON with category, vendor, brand, price, attribute, and pagination filters. |
| `GET` | `/api/products/:id` | Fetch one product. |
| `GET` | `/api/categories` | Fetch the two-level category tree. |
| `GET` | `/api/categories/:id/products` | List products in a category and descendants. |
| `GET` | `/api/vendors` | Fetch vendors from Valkey JSON. |
| `GET` | `/api/vendors/:id/products` | List products for one vendor. |
| `GET` | `/api/cart` | Fetch the guest or authenticated persistent cart. |
| `POST` | `/api/cart/items` | Add an item to a Valkey hash cart. |
| `PATCH` | `/api/cart/items/:productId` | Update a cart item quantity. |
| `DELETE` | `/api/cart/items/:productId` | Remove a cart item. |
| `POST` | `/api/cart/coupon` | Apply a Valkey JSON coupon and calculate discount. |
| `DELETE` | `/api/cart/coupon` | Remove the applied coupon. |
| `GET` | `/api/trending` | Challenge 4 global trending products by `1h`, `6h`, or `24h` window. |
| `GET` | `/api/trending/:categoryId` | Challenge 4 category trending products. |
| `POST` | `/api/events/view` | Record a weighted product view event. |
| `POST` | `/api/events/add-to-cart` | Record a weighted add-to-cart event. |
| `POST` | `/api/events/purchase` | Record a weighted purchase event. |
| `GET` | `/api/ads` | Challenge 5 select targeted ads by category or keyword context. |
| `POST` | `/api/ads` | Create or update a demo ad creative. |
| `POST` | `/api/ads/:adId/impression` | Record an ad impression with frequency and budget accounting. |
| `POST` | `/api/ads/:adId/click` | Record an ad click. |
| `GET` | `/api/ads/:adId/stats` | Fetch ad impressions, clicks, CTR, and spend. |
| `GET` | `/api/search?q=...` | Challenge 6 full-text product search with filters, sorting, pagination, and facets. |
| `GET` | `/api/search/suggest?q=...` | Product autocomplete suggestions. |
| `GET` | `/api/search/facets` | Full-text search facet counts. |
| `GET` | `/api/search/semantic?q=...` | Vector search with optional `categoryId`, `minPrice`, and `maxPrice` filters. |
| `GET` | `/api/products/:id/similar` | Similar products using stored embeddings. |
| `GET` | `/metrics` | Prometheus exposition text backed by Valkey metrics. |
| `GET` | `/api/analytics/dashboard` | JSON dashboard for orders, revenue, latency, active users, and inventory. |
| `GET` | `/api/observability/logs` | Recent structured logs from the `logs:app` Valkey Stream. |
| `GET` | `/api/observability/traces/:traceId` | Trace lookup across recent logs. |
| `GET` | `/api/observability/errors` | Top API errors from the log stream. |
| `GET` | `/api/observability/health` | Trace/log/OpenSearch health. |
| `POST` | `/api/checkout/start` | Create an order and reserve inventory through BullMQ. Requires `Idempotency-Key`. |
| `POST` | `/api/checkout/payment` | Run deterministic stub payment through BullMQ. Requires `Idempotency-Key`. |
| `POST` | `/api/checkout/confirm` | Commit reserved inventory and dispatch delivery through BullMQ. Requires `Idempotency-Key`. |
| `POST` | `/api/checkout/cancel` | Cancel an order and release reserved inventory. |
| `GET` | `/api/orders` | List orders owned by the caller. |
| `GET` | `/api/orders/:id` | Fetch one owned order. |
| `GET` | `/api/orders/:id/events` | Server-Sent Events stream for order state changes. |
| `GET` | `/api/delivery/check-serviceability` | Challenge 11 geospatial serviceability check. |
| `GET` | `/api/delivery/eta` | Estimate delivery distance and arrival time from two geo points. |
| `GET` | `/api/delivery/:trackingId/track` | Fetch delivery tracking status and ETA. |
| `POST` | `/api/delivery/:trackingId/location` | Update courier location, history, geo index, and pub/sub channel. |
| `GET` | `/api/ratelimit/config` | Challenge 12 rate-limit configuration. |
| `GET` | `/api/ratelimit/test` | Demo endpoint limited by Valkey sliding-window counters. |
| `POST` | `/api/recommendations/events` | Challenge 13 record view, add-to-cart, and purchase events. |
| `GET` | `/api/recommendations/recently-viewed` | Fetch recent products from Valkey list history. |
| `GET` | `/api/recommendations/similar/:productId` | Fetch co-purchase recommendations. |
| `GET` | `/api/recommendations/trending-for-you` | Fetch category-aware trending recommendations. |
| `GET` | `/api/recommendations/personalized` | Fetch personalized real-time recommendations. |
| `POST` | `/api/agent/search` | Challenge 14 agentic product search with Valkey conversation memory. |
| `GET` | `/api/agent/conversation/:sessionId` | Fetch the stored agent conversation. |
| `POST` | `/api/agent/feedback` | Record thumbs-up/down feedback for a product result. |
| `GET` | `/api/integrations` | Unified integration dashboard with live Valkey evidence for `Valkey-Integrations.md` mappings. |

Example checkout:

```bash
PRODUCT_ID="$(node -e "console.log(require('./src/fixtures').PRODUCT_FIXTURES[0].id)")"

curl -s http://localhost:4000/api/checkout/start \
  -H 'Content-Type: application/json' \
  -H 'X-User-Id: user:demo' \
  -H 'Idempotency-Key: demo-start-1' \
  -d "{\"items\":[{\"productId\":\"$PRODUCT_ID\",\"quantity\":1}],\"shippingAddress\":{\"city\":\"Hyderabad\",\"country\":\"IN\"}}"
```

## Validation

```bash
cd backend/checkout
npm run build
npm test
```

The integration tests require a live Valkey Bundle instance on `localhost:6379`. OpenSearch and the embedding service are used for the full browser demo; tests fall back to deterministic local embeddings when the embedding service is unavailable.
