# Valkey E-Commerce Demo

An e-commerce platform starter built with React, designed to showcase [Valkey](https://valkey.io/) capabilities across multiple subsystems. Created for the **Build Beyond Limits** hackathon powered by Valkey, hosted by React Hyderabad.

## Overview

This project provides a fully-featured e-commerce frontend that teams can extend with Valkey-powered backend services including authentication, search, caching, real-time recommendations, and more.

## Tech Stack

**Frontend:**
- React 18 (Create React App)
- React Router v6
- Bootstrap 5 + SCSS
- Phosphor Icons, React Slick, AOS animations

**Backend (to be implemented by teams):**
- [Valkey Bundle](https://github.com/valkey-io/valkey-bundle) (all modules included)
- BullMQ checkout integration in [`backend/checkout`](./backend/checkout)

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)
- [Docker](https://www.docker.com/) (for running Valkey)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/opensource-for-valkey/valkey-ecommerce-demo.git
cd valkey-ecommerce-demo
```

### 2. Start Valkey

Pull and run the Valkey bundle image which includes all modules:

```bash
docker pull valkey/valkey-bundle:9-alpine
docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:9-alpine
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

### Optional: Run the BullMQ checkout backend

The checkout backend demonstrates one focused Valkey integration: BullMQ queues backed by Valkey for inventory reservation, payment authorization, order confirmation, reservation release, and delivery dispatch.

```bash
cd backend/checkout
npm ci
npm run seed
npm run dev
```

The API runs at [http://localhost:4000](http://localhost:4000). See [`backend/checkout/README.md`](./backend/checkout/README.md) for endpoints and validation commands.

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
| `cd backend/checkout && npm run seed` | Seed Valkey JSON product fixtures |
| `cd backend/checkout && npm run dev` | Start the checkout API and BullMQ workers |
| `cd backend/checkout && npm test` | Run checkout unit and integration tests against Valkey |
| `cd backend/checkout && npm run build` | Type-check and compile the checkout backend |

## License

This project is open source and available for educational and hackathon purposes.
