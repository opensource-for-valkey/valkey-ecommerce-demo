# VAL-HYD Commerce Platform

A production-ready ecommerce demo powered by Valkey. The project now includes a modern React storefront, a modular Express API, Valkey-backed caching and commerce services, authentication, cart persistence, checkout, wishlist, recommendations, admin analytics, Docker support, and operational documentation.

## What Changed

The original repository was a static Create React App storefront template with no backend, no API, no auth flow, no database layer, and no executable Valkey integration. It has been upgraded into a full-stack platform:

- React 18 storefront with responsive product listing, product details, cart, checkout, account, wishlist, admin dashboard, loading states, empty states, toasts, SEO metadata, and error boundary.
- Premium 32-product catalog across smartphones, computing, audio, gaming, fashion, footwear, accessories, home, fitness, and beauty with 96 local high-resolution product renders.
- Express API with versioned REST routes under `/api/v1`.
- Valkey integration for product response cache, product detail cache, cart storage, wishlist storage, sessions, rate limiting, hot product tracking, recently viewed products, and order storage.
- Secure auth with bcrypt password hashing, JWT sessions, Valkey session revocation, and role-based admin access.
- Docker Compose stack with Valkey bundle, API, and nginx-hosted frontend.
- Clean production dependency audit with `npm audit --omit=dev`.

## Tech Stack

- Frontend: React 18, Vite, React Router 6, modular commerce pages/components, custom responsive CSS, Phosphor icons.
- Backend: Node.js, Express, Zod validation, Helmet, CORS, Morgan logging, bcryptjs, JWT.
- Valkey: `valkey/valkey-bundle:9-alpine`.
- Tooling: npm workspaces, Jest/React Testing Library, Node test runner, Supertest, Docker.

## Quick Start

```bash
npm install
docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:9-alpine
npm run dev
```

The default app URLs are:

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000/api/v1`
- Health check: `http://localhost:4000/api/v1/health`

If port `3000` is already in use:

```bash
cd frontend
$env:VITE_API_URL="http://localhost:4000/api/v1"
npm start -- --port 3001
```

## Demo Admin

```text
Email: admin@valkeycommerce.dev
Password: Admin123!
```

Set stronger credentials in `.env` for real deployments.

## Environment

Copy `.env.example` to `.env` at the repository root:

```bash
cp .env.example .env
```

Key settings:

- `PORT`: API port.
- `FRONTEND_URL`: comma-separated allowed browser origins.
- `JWT_SECRET`: required strong secret for production.
- `VALKEY_URL`: Valkey connection URL.
- `VALKEY_REQUIRED`: set `true` in production.

The API uses an in-memory fallback when Valkey is unavailable in development, but Docker and production should run with Valkey.

## Useful Commands

```bash
npm run dev                 # Start API and frontend
npm run dev:api             # Start only Express API
npm run dev:web             # Start only React app
npm run build               # Build frontend
npm test                    # Run backend and frontend tests
npm run smoke --workspace backend
npm audit --omit=dev
```

## Docker

```bash
docker compose up --build
```

Services:

- `valkey`: Valkey bundle on port `6379`.
- `api`: Express API on port `4000`.
- `frontend`: nginx static frontend on port `3000`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Verification

Current verification completed:

- `npm test`
- `npm run build --workspace frontend`
- `npm run smoke --workspace backend` against a real Valkey container
- Browser QA on desktop and mobile viewports
- Production dependency audit: `npm audit --omit=dev`

## Roadmap

Recommended next production steps:

- Replace in-memory seed data with PostgreSQL, MongoDB, or Valkey JSON/Search depending on workload.
- Add payment provider integration, webhook verification, and idempotency keys.
- Add email provider integration for order confirmation and password reset.
- Add refresh tokens, password reset, account verification, and stricter session device controls.
- Add OpenTelemetry traces, metrics export, and structured JSON logs.
- Add end-to-end tests for checkout and admin workflows.
