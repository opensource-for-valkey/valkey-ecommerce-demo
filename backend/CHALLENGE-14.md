# Challenge 14: Agentic Search

AI-powered product search with natural language understanding, multi-turn conversation memory in **Valkey**, and agent tools. The **React** storefront exposes a **floating assistant** on every page (no separate search route required).

## Prerequisites

- Node.js 18+
- **Valkey** 8+ with JSON support (`JSON.SET` / `JSON.GET`)

```bash
# Valkey with bundled modules (JSON, search)
docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:latest
```

## Setup

```bash
cd backend
npm install
```

`.env`:

```
PORT=3001
VALKEY_URL=redis://localhost:6379
```

(URI uses `redis://` scheme; the server is **Valkey**, not Redis.)

## Run

```bash
# Terminal 1 – API (backend/)
npm start

# Terminal 2 – React UI (frontend/)
npm start
# Open http://localhost:3000 — click the orange sparkle button (bottom-right)

# Terminal 3 – smoke tests (backend/)
npm run test:agent
```

### Floating assistant (React UI)

| Action | How |
|--------|-----|
| Open | Click **sparkle** FAB (bottom-right) on any page |
| Ask | Type **your own message** — analyzed live (not preset prompts) |
| Live badge | Green **Live search** on each reply (never stale cache in chat) |
| Valkey proof | Open **Valkey Live Monitor** (`/valkey-dashboard`) or chart icon in chat header |
| Expand | Header **expand** icon — large overlay |
| Examples | Optional “Challenge doc examples” — same queries as the spec |

### Verify Valkey is used

1. Open http://localhost:3000/valkey-dashboard  
2. Send a message in the AI assistant  
3. Watch the log: `CONVERSATION_GET` → `SEARCH_LIVE` → `CONVERSATION_SET`  
4. Each chat reply shows **Live search** + tools used + latency in the assistant

Programmatic open from React:

```js
import { openAgentAssistant } from './utils/openAgentAssistant';
openAgentAssistant();
```

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/agent/search` | Natural language search |
| GET | `/api/agent/conversation/:sessionId` | Conversation history |
| POST | `/api/agent/feedback` | Thumbs up/down on a result |
| POST | `/api/agent/refine` | Refine with same `sessionId` |
| GET | `/api/agent/debug/:sessionId` | Parsed params & tools per turn |
| GET | `/api/valkey/dashboard` | Valkey stats, key counts, event log |
| GET | `/api/valkey/stream` | SSE — real-time dashboard updates (2s) |

### Example

```bash
curl -X POST http://localhost:3001/api/agent/search \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"I need a birthday gift for my 10-year-old nephew who likes science\"}"

curl -X POST http://localhost:3001/api/agent/search \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"sess_...\",\"message\":\"Show me cheaper options\"}"
```

## Architecture

- `services/agent.js` – NLU parsing, tool orchestration, explanations
- `services/valkey.js` – Valkey conversation storage, cache, product search
- `routes/agent.js` – REST endpoints
- `frontend/src/components/AgentAssistant.jsx` – global floating UI
- `frontend/src/components/AgentSearchChat.jsx` – chat + product cards

### Agent tools (Challenge 14 spec)

| Tool | Purpose |
|------|---------|
| `search_products` | Keywords, category, filters |
| `filter_by_price` | Refine by min/max price (e.g. “cheaper options”) |
| `get_reviews` | Attach review snippets to results |
| `check_availability` | Stock & delivery |
| `get_similar` | Similar products |
| `ask_clarification` | Vague queries — asks follow-up before searching |
| `semantic_search` | Long natural-language queries |

### Acceptance criteria (verify locally)

```bash
npm run test:acceptance
```

| Criterion | How we meet it |
|-----------|----------------|
| NL → structured params | `parseQuery()` → `searchParams` in API response |
| Conversation memory | `conversation:{sessionId}` in Valkey, `mergeContext()` |
| “Cheaper options” | `applyRefinement()` + `search_products` → `filter_by_price` |
| Multi-tool sequence | `planToolSequence()` chains tools per query |
| Explanations | `generateReason()` on every product |
| &lt; 3s pipeline | `meta.latencyMs`, `meta.under3Seconds` |

### Valkey keys

- `conversation:{sessionId}` – JSON document, TTL 1800s
- `agent_cache:{queryHash}` – cached results, TTL 300s
- `user_preferences:{userId}` – long-term prefs
- `feedback:{sessionId}:{productId}` – user feedback
