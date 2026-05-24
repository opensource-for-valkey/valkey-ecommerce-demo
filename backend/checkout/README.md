# BullMQ Checkout on Valkey

This backend implements the checkout and inventory-tracking integration for the Valkey e-commerce demo. It uses BullMQ queues backed by Valkey, Valkey JSON for product and order documents, Lua scripts for atomic inventory mutation, idempotency keys for safe retries, and a Valkey Stream for order lifecycle events.

## Run Locally

Start Valkey Bundle from the repository root:

```bash
docker pull valkey/valkey-bundle:9-alpine
docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:9-alpine
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
| `VALKEY_URL` | unset | Full Redis-compatible Valkey URL. Takes precedence over host/port fields. |
| `VALKEY_HOST` | `localhost` | Valkey host when `VALKEY_URL` is unset. |
| `VALKEY_PORT` | `6379` | Valkey port when `VALKEY_URL` is unset. |
| `VALKEY_USERNAME` | unset | Optional ACL username. |
| `VALKEY_PASSWORD` | unset | Optional ACL password. |
| `VALKEY_TLS` | `false` | Enables TLS options when set to `true`. |
| `CHECKOUT_PORT` | `4000` | HTTP server port. |
| `CHECKOUT_WORKER_CONCURRENCY` | `4` | Worker concurrency per queue. |

## API

All endpoints require `X-User-Id`.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/checkout/start` | Create an order and reserve inventory through BullMQ. Requires `Idempotency-Key`. |
| `POST` | `/api/checkout/payment` | Run deterministic stub payment through BullMQ. Requires `Idempotency-Key`. |
| `POST` | `/api/checkout/confirm` | Commit reserved inventory and dispatch delivery through BullMQ. Requires `Idempotency-Key`. |
| `POST` | `/api/checkout/cancel` | Cancel an order and release reserved inventory. |
| `GET` | `/api/orders` | List orders owned by the caller. |
| `GET` | `/api/orders/:id` | Fetch one owned order. |
| `GET` | `/api/orders/:id/events` | Server-Sent Events stream for order state changes. |

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

The integration tests require a live Valkey Bundle instance on `localhost:6379`.
