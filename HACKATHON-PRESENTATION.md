# Challenge 14 — Hackathon Presentation Guide

**Time target:** 5–7 minutes demo + 2–3 minutes Q&A  
**One-liner:** *“We built an AI shopping agent that understands natural language, remembers context in Valkey, and runs multiple search tools in one conversation.”*

---

## Before you go on stage (15 min checklist)

| Step | Command / action |
|------|------------------|
| 1. Valkey running | `docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:latest` |
| 2. Backend | `cd backend` → `npm start` (port **3001**) |
| 3. Frontend | `cd frontend` → `npm start` (port **3000**) |
| 4. Smoke test | `cd backend` → `npm run test:acceptance` (should be **24 passed**) |
| 5. Browser tabs | Tab A: `http://localhost:3000` (store) |
| | Tab B: `http://localhost:3000/valkey-dashboard` (monitor) |
| 6. Close extra apps | Keep laptop on power, disable notifications |

**Backup:** If live demo fails, show pre-recorded 30s screen capture OR run `npm run test:acceptance` in terminal.

---

## Suggested slide outline (4–5 slides)

1. **Problem** — Keyword search fails for “gift for 10-year-old nephew who likes science”.
2. **Solution** — Agent + Valkey: NLU → tools → explained results + memory.
3. **Architecture** — React chat → Node API → Valkey (JSON conversations, cache, metrics).
4. **Live demo** — (no bullet list; switch to browser).
5. **Acceptance criteria** — Table mapping spec → what you built.

---

## Live demo script (5 minutes)

### Part 1 — Hook (30 sec)

> “Shoppers don’t search with filters—they describe what they need. We built an agent that parses that, searches products, explains why each item fits, and remembers the conversation in **Valkey**.”

Open the store homepage. Point to the **orange sparkle button** (bottom-right).

---

### Part 2 — Core flow — spec query (90 sec)

1. Click **sparkle** → assistant opens (orange border panel).
2. Type exactly (or paraphrase):

   > *I need a birthday gift for my 10-year-old nephew who likes science*

3. **Point out on screen while it loads:**
   - “Analyzing your message…”
   - Green badge: **Live search · Xms**
   - Line: **Tools: search_products**
   - Line: **Parsed: intent=gift_search, age=10, tags=[science,…]**

4. **Point to product cards:**
   - Name, price, rating
   - **Reason** line (age group, nephew, science, birthday)

> “That’s NLU turning free text into structured `searchParams`—intent, age group, tags—then `search_products` with explanations per item.”

---

### Part 3 — Conversation memory (60 sec)

5. In the **same chat** (same session), type:

   > *Show me cheaper options*

6. Highlight:
   - Tools: **`search_products`, `filter_by_price`**
   - Response mentions cheaper / lower budget
   - Products are lower-priced than before

> “This isn’t a new search from scratch—the agent read `conversation:{sessionId}` from Valkey, merged the previous science gift context, and ran a price filter on top.”

---

### Part 4 — Multi-tool + clarification (60 sec) — pick ONE

**Option A — Multi-tool (impressive):**

> *Show me highly rated science kits with reviews and check availability*

Show **3 tools**: `search_products` → `get_reviews` → `check_availability`  
Mention review text and stock line in reasons.

**Option B — Clarification (shows reasoning):**

> *help me find something*

Agent asks a clarifying question instead of guessing.  
> “The agent knows when the query is too vague—it uses `ask_clarification` before wasting a search.”

---

### Part 5 — Valkey proof (90 sec) — judges love this

1. Switch to **Tab B**: `http://localhost:3000/valkey-dashboard`
2. Say:

   > “Every operation is real—we don’t fake this with a SQL database.”

3. Send another message in the assistant (split screen or alt-tab).
4. On dashboard, point to **Live operation log**:
   - `CONVERSATION_GET`
   - `SEARCH_LIVE`
   - `CONVERSATION_SET`
   - (optional) `CACHE_SET`

5. Point to **Keys in Valkey**: `conversation:*`, `agent_cache:*`  
6. Point to counters incrementing.

---

### Part 6 — Close (30 sec)

> “We hit all acceptance criteria: NL parsing, multi-turn memory, cheaper-options refinement, multi-tool chains, per-product reasons, and sub-3-second responses. Stack is **React + Node + Valkey** only for this challenge.”

Optional: run in terminal (pre-opened):

```bash
cd backend && npm run test:acceptance
```

---

## Map each acceptance criterion (for judges)

| Criterion | What to say | What to show |
|-----------|-------------|--------------|
| NL → structured params | `parseQuery()` extracts intent, age, tags, recipient | Parsed line under agent reply + API `searchParams` |
| Conversation memory | Valkey JSON `conversation:{sessionId}`, 30 min TTL | 2nd message in same chat; dashboard `CONVERSATION_SET` |
| “Cheaper options” | `applyRefinement` + `filter_by_price` | Tools list + lower prices |
| Multi-tool sequence | `planToolSequence()` | reviews + availability query |
| Explanations | `generateReason()` | Reason text on each card |
| &lt; 3s | In-memory catalog + lean pipeline | `Live search · 45ms` badge |

---

## Architecture (30 sec verbal + optional diagram)

```
User (React floating chat)
    → POST /api/agent/search
        → agent.parseQuery() + planToolSequence()
        → Valkey: get conversation → run tools → set conversation
    ← products + reasons + meta (tools, latency, searchParams)
```

**Valkey keys (say aloud):**

- `conversation:{sessionId}` — multi-turn memory  
- `agent_cache:{hash}` — optional cache (chat uses **live** search)  
- `feedback:{sessionId}:{productId}` — thumbs up/down  

---

## Likely judge questions & short answers

**Q: Why Valkey instead of PostgreSQL?**  
A: Challenge requires low-latency session state, JSON documents, TTL on conversations, and cache keys—Valkey fits natively.

**Q: Is this ChatGPT?**  
A: No external LLM required for the demo. We use deterministic NLU (`parseQuery`) + tool orchestration; easy to swap in an LLM later for richer parsing.

**Q: How do you prove it’s not cached stale results?**  
A: Every chat reply shows **Live search**; cache is write-only for observability. Dashboard shows `SEARCH_LIVE` per message.

**Q: What if Valkey is down?**  
A: API fails gracefully; health check shows offline. For demo, keep Docker container running.

**Q: Scale?**  
A: Valkey cluster, FT.SEARCH / vector indexes on product catalog (integration points already in `valkey.js`).

---

## Do / Don’t

| Do | Don’t |
|----|--------|
| Type your own query first | Rely only on “example” chips |
| Keep Valkey dashboard visible for 30s | Skip proving persistence |
| Mention tool names from the spec | Say “Redis” (say **Valkey**) |
| Show cheaper-options follow-up | Rush through without reasons |
| Have `test:acceptance` ready as backup | Apologize for long npm installs on stage |

---

## URLs cheat sheet

| What | URL |
|------|-----|
| Store + assistant | http://localhost:3000 |
| Valkey monitor | http://localhost:3000/valkey-dashboard |
| API health | http://localhost:3001/health |
| Acceptance tests | `npm run test:acceptance` (in `backend/`) |

---

## 30-second elevator pitch (memorize)

> “We built Challenge 14: an agentic product search assistant. Users talk naturally on any page of our React store. The backend parses their intent, runs tools like search, price filter, reviews, and availability, and explains every recommendation. Context lives in Valkey as JSON so follow-ups like ‘show me cheaper options’ still understand the original gift search. We prove Valkey usage with a live ops dashboard and pass all acceptance tests in under three seconds.”

Good luck.
