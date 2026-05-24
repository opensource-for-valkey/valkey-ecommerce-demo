# Valkey E-Commerce Demo

An e-commerce platform starter built with React, designed to showcase [Valkey](https://valkey.io/) capabilities across multiple subsystems. Created for the **Build Beyond Limits** hackathon powered by Valkey, hosted by React Hyderabad.

## Overview

This project provides a judge-demo-ready e-commerce frontend and integrated Valkey backend covering Challenges 1-14 from `HACKATHON.md`: authentication, catalog, cart, trending, ads, full-text search, vector search, analytics, observability, checkout, delivery tracking, rate limiting, recommendations, and agentic search.

## Tech Stack

**Frontend:**
- React 18 (Create React App)
- React Router v6
- Bootstrap 5 + SCSS
- Phosphor Icons, React Slick, AOS animations

**Backend:**
- [Valkey Bundle](https://github.com/valkey-io/valkey-bundle) (all modules included)
- Node.js + TypeScript + Express API in [`backend/checkout`](./backend/checkout)
- BullMQ checkout workers backed by Valkey
- Valkey JSON, Search/Vector Search, Lua, Sorted Sets, HyperLogLog, Streams, and TTL keys
- Python FastAPI embedding service in [`backend/embeddings`](./backend/embeddings)
- OpenSearch forwarder for structured logs

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)
- [Docker](https://www.docker.com/) (for running Valkey, OpenSearch, and embeddings)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/opensource-for-valkey/valkey-ecommerce-demo.git
cd valkey-ecommerce-demo
```

### 2. Start Valkey, OpenSearch, and embeddings

Use Compose to start the services required for the full E2E demo:

```bash
docker compose up -d valkey opensearch embeddings
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Run the frontend

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Run the integrated Valkey backend

The backend serves the authentication, product catalog, persistent cart, search, analytics, observability, checkout, delivery, rate limiting, recommendations, and agentic search APIs.

```bash
cd backend/checkout
npm ci
npm run seed
npm run dev
```

The API runs at [http://localhost:4000](http://localhost:4000). Set `REACT_APP_CHECKOUT_API_BASE_URL=http://localhost:4000` when starting the frontend if you use a different API port.

Challenge demo pages:

| Page | Challenge |
|------|-----------|
| `/account` | Challenge 1 Valkey-backed authentication and sessions |
| `/catalog` | Challenge 2 Valkey JSON catalog with filters and pagination |
| `/cart` | Challenge 3 persistent cart and coupons |
| `/growth` | Challenges 4-6 trending products, targeted ads, and full-text search |
| `/semantic-search` | Challenge 7 vector similarity search |
| `/analytics` | Challenge 8 Prometheus analytics |
| `/observability` | Challenge 9 OpenSearch observability |
| `/cart` and `/checkout` | Challenge 10 inventory checkout |
| `/delivery` | Challenge 11 delivery tracking with geolocation |
| `/ratelimit` | Challenge 12 Valkey sliding-window API rate limiting |
| `/recommendations` | Challenge 13 real-time recommendations |
| `/agentic-search` | Challenge 14 Valkey-backed agentic search memory |
| `/integrations` | Valkey OSS integration coverage and live runtime evidence |

## Running Tests

The frontend uses Jest and React Testing Library (included with Create React App).

```bash
cd frontend

# Run tests in watch mode (interactive)
npm test

# Run tests once (CI mode)
CI=true npm test

# Run tests with coverage report
CI=true npm test -- --coverage
```

## Building for Production

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/build` folder.

## Project Structure

```
valkey-ecommerce-demo/
├── frontend/                  # React application
│   ├── public/
│   │   └── assets/           # Static CSS, JS, images
│   ├── src/
│   │   ├── components/       # Reusable UI components (header, footer, cards, etc.)
│   │   ├── helper/           # Utility components (animations, preloader, scroll)
│   │   ├── pages/            # Page-level components
│   │   │   ├── HomePageOne.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── ProductDetailsPageOne.jsx
│   │   │   ├── AccountPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── VendorPage.jsx
│   │   │   ├── BlogPage.jsx
│   │   │   └── ...
│   │   ├── App.js            # Root component with routing
│   │   └── index.js          # Entry point
│   └── package.json
├── backend/
│   └── checkout/              # BullMQ + Valkey checkout integration
├── documentation/            # Project documentation site
└── README.md
```

## Hackathon Challenge Areas

Teams will implement backend subsystems using Valkey:

| Subsystem | Description |
|-----------|-------------|
| User Authentication | Login, registration, session management |
| Catalog | Product catalog with DocumentDB |
| Shopping Cart | Cart management with coupon support |
| Trending Products | Track and display trending items |
| Ads | Advertisement placement and targeting |
| Full-Text Search | Product search with Valkey Search |
| Vector Similarity Search | Semantic product search |
| Analytics | Metrics with Prometheus |
| Observability | Logging and tracing with OpenSearch |
| Checkout | Order processing with inventory tracking |
| Delivery | Delivery tracking with geolocation |
| Rate Limiting | API rate limiting |
| Real-time Recommendations | Personalized product suggestions |
| Agentic Search | AI-powered search experience |

## Connecting to Valkey

Use the [valkey-bundle](https://github.com/valkey-io/valkey-bundle) Docker image to access all Valkey modules:

```bash
docker pull valkey/valkey-bundle:9-alpine
docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:9-alpine
```

Connect from your backend service:
```
Host: localhost
Port: 6379
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm test` | Run tests in watch mode |
| `CI=true npm test` | Run tests once |
| `CI=true npm test -- --coverage` | Run tests with coverage |
| `npm run build` | Create production build |
| `docker exec -it valkey valkey-cli` | Open Valkey CLI |

Backend checkout commands:

| Command | Description |
|---------|-------------|
| `docker compose up -d valkey opensearch embeddings` | Start the Valkey Bundle, OpenSearch, and embedding service |
| `cd backend/checkout && npm run seed` | Seed Valkey JSON products, ads, delivery fixtures, search indexes, and embeddings |
| `cd backend/checkout && npm run dev` | Start the API, BullMQ workers, and OpenSearch log forwarder |
| `cd backend/checkout && npm test` | Run checkout, search, analytics, observability, delivery, rate limit, recommendation, and agent tests against Valkey |
| `cd backend/checkout && npm run build` | Type-check and compile the backend |

Integration evidence:

| Endpoint | Description |
|----------|-------------|
| `/api/integrations` | Live Valkey-backed dashboard mapping implemented demo surfaces to `Valkey-Integrations.md` and `HACKATHON.md` |

## License

This project is open source and available for educational and hackathon purposes.
