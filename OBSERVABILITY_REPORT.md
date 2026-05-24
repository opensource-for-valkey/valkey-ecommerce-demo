# VoiceCart AI — Observability Maturity Report

> **Role:** Senior Observability Engineer  
> **Project:** VoiceCart AI (FastAPI + Groq LLM + Valkey)  
> **Date:** 2026-05-24  
> **Scope:** `backend/` — main.py, agent.py, config.py, valkey_client.py, tools/

---

## Executive Summary

VoiceCart AI is at **early prototype stage** with near-zero observability coverage. The application has no structured logging, no metrics, no distributed tracing, no alerting, and no dashboards. It is currently impossible to debug, operate, or scale in production without significant instrumentation work.

The architecture is clean and well-structured — adding observability is straightforward from here.

**Overall Maturity: 1.3 / 5 — Pre-Observable**

---

## Maturity Scorecard

| Area | Score | Status |
|------|-------|--------|
| Logging | 1 / 5 | Only `print()` in seed script — no logging module used anywhere |
| Metrics | 1 / 5 | Zero metrics, no Prometheus endpoint |
| Distributed Tracing | 1 / 5 | No trace IDs, no spans, no correlation |
| Error Handling | 2 / 5 | Basic try/except but swallows error context |
| Health Checks | 2 / 5 | `/health` exists but only checks Valkey |
| Alerting | 1 / 5 | Zero alerting rules or channels defined |
| Dashboards | 1 / 5 | No dashboards exist |
| SLOs / Error Budgets | 1 / 5 | Not defined anywhere |
| Incident Readiness | 1 / 5 | No runbooks, no on-call setup |
| **Overall** | **1.3 / 5** | **Pre-Observable** |

---

## Area 1 — Logging (Score: 1/5)

### What Exists
- `print()` statements only in `seed_data.py` (lines 174–248)
- Zero logging in `main.py`, `agent.py`, or any tool file

### Critical Gaps
```python
# agent.py — run_agent() has zero logging
def run_agent(message, session_id):
    # No log: who called, what message, what session
    while True:
        response = client.chat.completions.create(...)
        # No log: which tools called, duration, failures

# valkey_client.py — silent failure
def ping():
    try:
        return r.ping()
    except Exception:
        return False  # Failure disappears silently. No log, no alert.
```

### Missing
- Python `logging` module not imported anywhere
- No structured logging (JSON format)
- No log levels (DEBUG / INFO / WARNING / ERROR)
- No request/response logging in `main.py`
- No contextual fields (session ID, trace ID, user, timestamp)
- No log file output or rotation policy
- No log aggregation target

### Business Impact
When the agent gives wrong results or crashes in production, there is zero ability to debug. No replay of what happened. No way to know which user session broke.

---

## Area 2 — Metrics (Score: 1/5)

### What Exists
Nothing.

### Missing Metrics

| Metric Name | Type | Purpose |
|-------------|------|---------|
| `api_requests_total` | Counter | Total traffic by endpoint |
| `api_request_duration_seconds` | Histogram | Latency distribution (p50/p95/p99) |
| `agent_tool_calls_total` | Counter | Which tools are used most |
| `groq_api_errors_total` | Counter | LLM failure rate |
| `valkey_operation_duration_seconds` | Histogram | DB query latency |
| `cart_adds_total` | Counter | Core business funnel metric |
| `orders_placed_total` | Counter | Revenue proxy |
| `active_sessions` | Gauge | Current concurrent load |
| `search_query_duration_seconds` | Histogram | Vector KNN search latency |

No `/metrics` endpoint exists — Prometheus cannot scrape anything.

### Business Impact
No visibility into performance degradation, traffic spikes, or business funnel drop-offs.

---

## Area 3 — Distributed Tracing (Score: 1/5)

### What Exists
Nothing.

### The Specific Blind Spot — The Agentic Loop

```
User voice message
  └─► Groq API call #1       ← how long? which model version?
        └─► tool: search_products   ← Valkey KNN query — how long?
              └─► tool: add_to_cart ← another Valkey op
                    └─► Groq API call #2
                          └─► Final spoken response
```

Without tracing you cannot answer:
- Which step in the chain is slow?
- Did the LLM or Valkey query add the latency?
- How many tool calls does the average request trigger?
- Where exactly did this specific session fail mid-chain?

### Missing
- No OpenTelemetry setup
- No trace IDs propagated across calls
- No span creation for agent steps or tool calls
- No `X-Trace-Id` response headers
- No trace exporter (Jaeger / Zipkin / Grafana Tempo)
- No correlation between Groq calls and Valkey operations

---

## Area 4 — Error Handling (Score: 2/5)

### What Exists
Basic try/except in `main.py` (line 41–45) and `agent.py` (lines 208–211).

### Three Specific Problems

**Problem 1 — Silent swallow (valkey_client.py)**
```python
def ping():
    try:
        return r.ping()
    except Exception:
        return False  # Error vanishes. No log. No metric. No alert.
```

**Problem 2 — Stack trace lost (main.py)**
```python
except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
    # str(e) loses the stack trace, request context, and session_id
```

**Problem 3 — Tool failures invisible to the agent (agent.py)**
```python
except Exception as e:
    return json.dumps({"error": str(e)})
    # The agent sees {"error": "..."} and continues the loop
    # User gets a garbled response. You never know why.
```

### Missing
- No specific error types (all catch bare `Exception`)
- No error context captured (operation name, inputs, session)
- No retry logic for transient failures (Groq rate limits, Valkey timeouts)
- No circuit breaker for downstream services
- No error metrics or alerting thresholds
- No error tracking service (Sentry / Rollbar)

---

## Area 5 — Health Checks (Score: 2/5)

### What Exists
```python
@app.get("/health")
def health():
    valkey_ok = ping()
    return {"status": "ok" if valkey_ok else "degraded", "valkey": valkey_ok}
```

### What It Does NOT Check

| Dependency | Checked? | Why It Matters |
|-----------|----------|----------------|
| Valkey connectivity | ✅ Yes | Basic data layer |
| Groq API reachability | ❌ No | Core LLM dependency |
| Search index (`idx:products`) loaded | ❌ No | Search fails silently if missing |
| Products seeded (count > 0) | ❌ No | Empty catalog = broken demo |
| Memory pressure | ❌ No | OOM risk under load |
| Readiness vs liveness | ❌ No | Kubernetes/Docker needs both separate |

---

## Area 6 — Alerting (Score: 1/5)

### What Exists
Nothing.

### Minimum Alerts Needed

| Alert | Threshold | Severity | Channel |
|-------|-----------|----------|---------|
| API error rate > 5% | 5 min window | P1 | Immediate |
| Groq API returning 429/500 | Any occurrence | P1 | Immediate |
| Valkey connection lost | Immediate | P1 | Immediate |
| API p95 latency > 3s | 5 min window | P2 | Warning |
| Zero orders in 1 hour (business hours) | 1 hr | P2 | Warning |
| Cart abandonment spike > 80% | 30 min | P3 | Info |
| Search returning 0 results > 20% of queries | 15 min | P2 | Warning |

---

## Area 7 — Dashboards (Score: 1/5)

### What Exists
Nothing.

### Minimum Dashboards Needed

```
Dashboard 1: System Health
├── Request rate, error rate, latency (RED metrics)
├── Valkey connection status + operation latency
└── Server memory / CPU

Dashboard 2: Agent Performance
├── Tool call frequency per tool name
├── Groq LLM response times
├── Agentic loop iterations per request
└── Failed tool calls by tool name

Dashboard 3: Business Metrics
├── Voice queries per hour
├── Cart adds → order completions funnel
├── Most searched products (from Valkey Sorted Set)
└── Trending products live feed
```

---

## Area 8 — SLOs / Error Budgets (Score: 1/5)

### What Exists
Nothing defined.

### Recommended SLOs

| SLO | Target | Measurement Method |
|-----|--------|--------------------|
| API availability | 99.5% | Successful responses / total |
| Voice query response time | p95 < 3 seconds | Histogram percentile |
| Cart operation success rate | 99.9% | add/remove success rate |
| Order placement success | 99.9% | place_order tool success rate |
| Vector search latency | p95 < 500ms | KNN query histogram |
| Agent tool call success | 98% | tool result non-error rate |

---

## Area 9 — Incident Readiness (Score: 1/5)

### What Exists
Nothing.

### Missing
- No runbooks for common failure scenarios
- No on-call rotation defined
- No incident response playbook
- No post-mortem template
- No communication channels (Slack alerts, PagerDuty)
- No rollback procedure documented
- No backup/restore procedure for Valkey data

---

## Findings Prioritized by Business Impact

### P1 — Critical (Immediate)

| Finding | File | Risk |
|---------|------|------|
| Zero logging in agent loop | `agent.py` | Cannot debug any production failure |
| Silent exception swallow | `valkey_client.py` | Valkey failures invisible |
| No trace ID on requests | `main.py` | Cannot correlate logs to requests |
| Tool errors not surfaced | `agent.py` | Users get wrong answers silently |

### P2 — High (This Week)

| Finding | File | Risk |
|---------|------|------|
| No request duration logging | `main.py` | Cannot detect slow endpoints |
| Health check incomplete | `main.py` | False positive "ok" when LLM is down |
| No Prometheus endpoint | `main.py` | Cannot measure anything |
| No error rate tracking | All | Cannot set reliability targets |

### P3 — Medium (This Month)

| Finding | Impact |
|---------|--------|
| No Grafana dashboards | No operational visibility |
| No alerting rules | Failures discovered by users, not engineers |
| No SLO definitions | No reliability contract |
| No business funnel metrics | Cannot measure product success |

### P4 — Low (Strategic)

| Finding | Impact |
|---------|--------|
| No OpenTelemetry tracing | Deep performance analysis impossible |
| No error budget tracking | Cannot make data-driven reliability decisions |
| No log aggregation | Logs lost on container restart |
| No incident runbooks | Slow MTTR during outages |

---

## Recommended Roadmap

### Quick Wins — 1 to 2 Days

**1. Structured JSON logging**
```python
# backend/config.py — add this
import logging, json

class JSONFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({
            "timestamp": self.formatTime(record),
            "level":     record.levelname,
            "message":   record.getMessage(),
            "service":   "voicecart",
            "module":    record.module,
        })

handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logging.basicConfig(level=logging.INFO, handlers=[handler])
logger = logging.getLogger("voicecart")
```

**2. Request logging middleware**
```python
# backend/main.py — add middleware
import time, uuid

@app.middleware("http")
async def log_requests(request, call_next):
    trace_id = str(uuid.uuid4())[:8]
    start    = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(json.dumps({
        "trace_id":    trace_id,
        "method":      request.method,
        "path":        request.url.path,
        "status":      response.status_code,
        "duration_ms": duration,
    }))
    response.headers["X-Trace-Id"] = trace_id
    return response
```

**3. Log every agent tool call**
```python
# backend/agent.py — inside run_tool()
logger.info(json.dumps({
    "event":      "tool_call",
    "tool":       tool_name,
    "session_id": session_id,
    "args":       tool_args,
}))
result = ...  # execute tool
logger.info(json.dumps({
    "event":   "tool_result",
    "tool":    tool_name,
    "success": "error" not in json.loads(result),
}))
```

**4. Expanded health check**
```python
# backend/main.py
@app.get("/health")
def health():
    from valkey_client import r
    index_ok = False
    try:
        info = r.execute_command("FT.INFO", "idx:products")
        index_ok = True
    except Exception:
        pass

    checks = {
        "valkey":       ping(),
        "search_index": index_ok,
        "groq_api_key": bool(GROQ_API_KEY and "dummy" not in GROQ_API_KEY),
    }
    return {
        "status": "ok" if all(checks.values()) else "degraded",
        "checks": checks
    }
```

---

### Medium-Term — 1 to 2 Weeks

**Add Prometheus metrics**
```python
# requirements.txt — add: prometheus-client

from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import Response

REQUEST_COUNT   = Counter("api_requests_total",            "Total requests",    ["method", "endpoint", "status"])
REQUEST_LATENCY = Histogram("api_request_duration_seconds","Request latency",   ["endpoint"])
TOOL_CALLS      = Counter("agent_tool_calls_total",        "Tool calls",        ["tool_name", "success"])
CART_ADDS       = Counter("cart_adds_total",               "Cart add events")
ORDERS          = Counter("orders_placed_total",           "Orders placed")
ACTIVE_SESSIONS = Gauge("active_sessions_current",         "Active sessions")

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
```

**Add monitoring stack to docker-compose.yml**
```yaml
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: voicecart
    restart: unless-stopped
```

**Valkey Streams as log buffer** *(uses Valkey directly — impresses hackathon judges)*
```python
# Every log entry also goes to Valkey Stream
r.xadd("logs:app", {
    "level":      "ERROR",
    "service":    "cart-agent",
    "trace_id":   trace_id,
    "message":    "Tool call failed",
    "session_id": session_id,
    "timestamp":  datetime.utcnow().isoformat(),
})
r.xtrim("logs:app", maxlen=100000)  # keep last 100K entries
```

---

### Long-Term Strategic — 1 Month+

1. **Full OpenTelemetry instrumentation** — auto-instrument FastAPI, Redis client, and HTTP calls. Every tool call becomes a child span.
2. **Grafana dashboards** — System health, agent performance, and business funnel in three dashboards.
3. **SLO tracking** — Error budget burn rate alerts in AlertManager.
4. **Alerting rules** — AlertManager connected to Slack/email for all P1/P2 conditions.
5. **Centralized log aggregation** — Forward from Valkey Streams to OpenSearch (Challenge 9 in HACKATHON.md).
6. **Business analytics endpoint** — `/api/analytics/dashboard` powered entirely by Valkey data structures (Sorted Sets for trending, HyperLogLog for unique users, Streams for events).

---

## Infrastructure Note

`docker-compose.yml` now includes **RedisInsight** on port `5540` — this gives you a visual UI for Valkey data, key browsing, and basic query execution. This is useful for debugging during development but is not a substitute for application-level observability.

---

## Final Verdict

| Phase | Action | Maturity Gained |
|-------|--------|-----------------|
| Now | Structured logging + request middleware + trace ID | 1.3 → 2.5 |
| This week | Prometheus `/metrics` + expanded health check | 2.5 → 3.5 |
| This month | Grafana dashboards + alerting + SLOs | 3.5 → 4.5 |
| Strategic | OpenTelemetry + log aggregation + error budgets | 4.5 → 5.0 |

**Recommended immediate action:** Implement the Quick Wins. Half a day of work takes this application from undebuggable to operationally sound — and demonstrates production engineering maturity to hackathon judges.
