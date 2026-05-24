# Nocturne & Co. — Backend

Unified backend for the Valkey hackathon project, combining two subsystems:

1. **Agentic Search** (NL + semantic search, recommendations) — `src/`, runs on port `4000`
2. **Visual Search** (CLIP image-similarity) — backend root (`server.mjs`, `seed.mjs`, `lib/`), runs on a separate port

Both speak to a single Valkey instance with the search module loaded.

## Prerequisites

Valkey with the search module — use the bundle image:

```bash
docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:9-alpine
```

## Setup

```bash
cd backend
npm install
cp .env.example .env       # optional — drop in GEMINI_API_KEY for LLM parsing
```

## Agentic Search (default `npm start`)

```bash
npm start                  # serves the NL/semantic API on PORT (default 4000)
```

The server seeds Valkey on first boot. Health check:

```
curl http://localhost:4000/health
```

To force a clean re-seed:

```
docker exec valkey valkey-cli FLUSHDB
npm start
```

To re-resolve every product's hero image without touching the catalogue:

```
npm run reseed:images
```

## Visual Search (image-similarity, separate process)

Lives at `server.mjs` at the backend root. Uses CLIP embeddings
(`@xenova/transformers`) + Valkey vector search.

```bash
# In a separate terminal, on a different PORT so it doesn't clash:
$env:PORT=4100; node seed.mjs        # one-time: embed product images
$env:PORT=4100; node server.mjs      # serves /api/search/image
```

The frontend page `/search/image` calls this endpoint. Override the URL via
`REACT_APP_SEARCH_API` in `frontend/.env` if you change the port.

## Folder layout

```
backend/
  src/                         # agentic backend (port 4000)
    server.js                  # Express bootstrap + auto-seed
    routes/, agent/, tools/, services/, valkey/, data/, scripts/
  server.mjs                   # visual search server (separate port)
  seed.mjs                     # visual search seeder
  lib/embed.mjs                # CLIP wrapper (@xenova/transformers)
  lib/valkey.mjs               # iovalkey client + HNSW vector index
  products.json                # visual search catalogue
  package.json
  .env.example
```

## How requests flow (agentic)

A `POST /api/agent/search` with `{ sessionId, message }`:

1. Look up `conversation:<sessionId>` from Valkey (or create it).
2. Track the message in `search:popular` + `search:recent:<sid>` for suggestions.
3. Run rule-based NLU; optionally augment with Gemini if `GEMINI_API_KEY` is set.
4. Planner emits a list of tool steps based on intent + context.
5. Tools run sequentially with per-args caching in `agent_cache:<hash>` (5 min TTL).
6. Results are fused on `productId`, sorted, top-6 explained.
7. Conversation context is persisted under `conversation:<sessionId>` (30 min TTL).

## How requests flow (visual)

```
[upload image] → CLIP → 512-dim vector
              → Valkey FT.SEARCH KNN over products_idx (HNSW, cosine)
              → top 24 product hashes → JSON to frontend
```

## Catalogue indexes (agentic)

- `product:<id>` JSON document
- `index:products` SET of every product id
- `category:<slug>`, `brand:<slug>` SET membership
- `products:price`, `products:price:<slug>` ZSETs for range queries
- `products:rating`, `products:rating:<slug>` ZSETs
- `index:stock`, `index:stock:low` for live stock
- `trending:global:1h`, `trending:category:<slug>:1h` ZSETs
- `index:embeddings` HASH of 8-dim toy embeddings (semantic_search)
- `product:<id>` HASH (visual search variant) with binary CLIP embeddings + `products_idx`

## Environment

```
VALKEY_URL=redis://localhost:6379
PORT=4000
CONVERSATION_TTL=1800
AGENT_CACHE_TTL=300
GEMINI_API_KEY=               # optional
GEMINI_MODEL=gemini-1.5-flash

# Visual search
VECTOR_INDEX=products_idx
VECTOR_DIM=512
TOP_K=24
```

## Notes

- Both subsystems share the same Valkey instance but use different key prefixes
  and indexes.
- They run as **two separate processes** (different ports) — not yet integrated
  into a single Express app.

## License

Open source, hackathon use.
