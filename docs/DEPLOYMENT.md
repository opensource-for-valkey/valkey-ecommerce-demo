# Deployment Guide

## Local Docker Deployment

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000/api/v1`
- Health: `http://localhost:4000/api/v1/health`

## Production Checklist

- Set `NODE_ENV=production`.
- Set a strong `JWT_SECRET`.
- Set `VALKEY_REQUIRED=true`.
- Set `VALKEY_URL` to the production Valkey endpoint.
- Set `FRONTEND_URL` to the deployed frontend origin.
- Run `npm audit --omit=dev`.
- Use HTTPS at the edge.
- Add centralized logging and metrics collection.
- Rotate demo admin credentials.
- Replace seed catalog with durable data storage before accepting real orders.

## Frontend

The frontend is compiled by Vite and served by nginx in Docker.

Build argument:

```bash
VITE_API_URL=https://api.example.com/api/v1
```

## Backend

The backend Docker image runs:

```bash
node src/server.js
```

It exposes port `4000` and provides:

```bash
GET /api/v1/health
```

## Valkey

The compose file uses:

```text
valkey/valkey-bundle:9-alpine
```

Persistent data is stored in the `valkey-data` Docker volume.

## CI/CD Friendly Commands

```bash
npm ci
npm test
npm run build --workspace frontend
npm audit --omit=dev
docker compose build
```
