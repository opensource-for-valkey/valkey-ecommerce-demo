import type { Redis } from "ioredis";
import type { CheckoutConfig } from "./config";
import { WAREHOUSES_KEY } from "./delivery";
import { FULL_TEXT_INDEX } from "./engagement";
import { RATE_LIMIT_CONFIG } from "./rateLimit";
import type { CheckoutQueues } from "./queues";
import { PRODUCT_VECTOR_INDEX } from "./search";
import { listProducts } from "./store";

interface IntegrationCard {
  id: string;
  specNumber?: number;
  specSource: "Valkey-Integrations.md" | "HACKATHON.md" | "Valkey-Integrations.md Other Ideas";
  project: string;
  track: string;
  status: "implemented" | "configured" | "demo-ready";
  summary: string;
  frontendRoute?: string;
  apiRoutes: string[];
  valkeyCapabilities: string[];
}

const INTEGRATIONS: IntegrationCard[] = [
  {
    id: "bullmq-checkout",
    specNumber: 6,
    specSource: "Valkey-Integrations.md",
    project: "BullMQ",
    track: "Messaging / Queue Library",
    status: "implemented",
    summary: "Checkout jobs run through BullMQ queues backed by Valkey, with Lua-based inventory reservation and idempotent order transitions.",
    frontendRoute: "/cart",
    apiRoutes: ["/api/checkout/start", "/api/checkout/payment", "/api/checkout/confirm", "/api/orders"],
    valkeyCapabilities: ["BullMQ queue keys", "Lua scripts", "JSON orders", "Streams order events"],
  },
  {
    id: "fastapi-embeddings",
    specNumber: 16,
    specSource: "Valkey-Integrations.md",
    project: "FastAPI embedding service",
    track: "Web Framework / ML service",
    status: "configured",
    summary: "A Python FastAPI service generates sentence-transformer embeddings used by Valkey vector search.",
    frontendRoute: "/semantic-search",
    apiRoutes: ["/api/search/semantic", "/api/products/:id/similar"],
    valkeyCapabilities: ["JSON embedding field", "Valkey Search HNSW vector index"],
  },
  {
    id: "valkey-vector-rag",
    specNumber: 15,
    specSource: "Valkey-Integrations.md",
    project: "LangChain/RAG-ready vector store pattern",
    track: "AI/ML Platform",
    status: "implemented",
    summary: "The product catalog is indexed for semantic retrieval in Valkey, matching the vector-store behavior needed by RAG frameworks.",
    frontendRoute: "/semantic-search",
    apiRoutes: ["/api/search/semantic"],
    valkeyCapabilities: ["Vector similarity search", "JSON product documents", "metadata filters"],
  },
  {
    id: "prometheus-analytics",
    specSource: "HACKATHON.md",
    project: "Prometheus metrics endpoint",
    track: "Analytics / Observability",
    status: "implemented",
    summary: "Business and API counters are aggregated in Valkey and exposed in Prometheus exposition format.",
    frontendRoute: "/analytics",
    apiRoutes: ["/metrics", "/api/analytics/dashboard"],
    valkeyCapabilities: ["Hashes", "Sorted sets", "HyperLogLog", "TTL buckets"],
  },
  {
    id: "opensearch-observability",
    specSource: "HACKATHON.md",
    project: "OpenSearch log forwarder",
    track: "Observability",
    status: "implemented",
    summary: "Structured API logs are buffered durably in Valkey Streams before OpenSearch indexing.",
    frontendRoute: "/observability",
    apiRoutes: ["/api/observability/logs", "/api/observability/health"],
    valkeyCapabilities: ["Streams", "Consumer groups", "Trace keys"],
  },
  {
    id: "realtime-delivery",
    specNumber: 26,
    specSource: "Valkey-Integrations.md",
    project: "Realtime delivery channel",
    track: "Websockets / realtime",
    status: "demo-ready",
    summary: "Delivery location updates publish through Valkey Pub/Sub and stream to the frontend with SSE, matching the realtime channel expected from websocket integrations.",
    frontendRoute: "/delivery",
    apiRoutes: ["/api/delivery/:trackingId/track", "/api/delivery/:trackingId/location"],
    valkeyCapabilities: ["Pub/Sub", "GEO", "JSON delivery state"],
  },
  {
    id: "rate-limiter",
    specSource: "Valkey-Integrations.md Other Ideas",
    project: "API rate limiter",
    track: "Security / API Gateway",
    status: "implemented",
    summary: "A sliding-window rate limiter uses Valkey sorted sets and emits standard rate-limit headers.",
    frontendRoute: "/ratelimit",
    apiRoutes: ["/api/ratelimit/config", "/api/ratelimit/test"],
    valkeyCapabilities: ["Sorted sets", "TTL keys"],
  },
  {
    id: "ad-click-aggregation",
    specSource: "Valkey-Integrations.md Other Ideas",
    project: "Ad click aggregation",
    track: "Growth / Ad Tech",
    status: "implemented",
    summary: "Targeted ads, frequency capping, spend tracking, impressions, clicks, and CTR are maintained in Valkey.",
    frontendRoute: "/growth",
    apiRoutes: ["/api/ads", "/api/ads/:adId/stats"],
    valkeyCapabilities: ["Sorted sets", "Counters", "TTL keys", "JSON ad documents"],
  },
  {
    id: "agentic-memory",
    specNumber: 32,
    specSource: "Valkey-Integrations.md",
    project: "Agentic search memory",
    track: "AI/ML Agentic",
    status: "implemented",
    summary: "Agent conversations, tool context, product feedback, and result refinements are persisted in Valkey for low-latency follow-up search.",
    frontendRoute: "/agentic-search",
    apiRoutes: ["/api/agent/search", "/api/agent/conversation/:sessionId", "/api/agent/feedback"],
    valkeyCapabilities: ["JSON conversation memory", "TTL keys", "Hash feedback counters"],
  },
  {
    id: "ecommerce-core",
    specNumber: 29,
    specSource: "Valkey-Integrations.md",
    project: "E-commerce platform integration",
    track: "E-commerce",
    status: "implemented",
    summary: "The storefront demonstrates Valkey as a primary e-commerce data plane for catalog, cart, checkout, delivery, recommendations, and search.",
    frontendRoute: "/catalog",
    apiRoutes: ["/api/products", "/api/cart", "/api/recommendations/personalized"],
    valkeyCapabilities: ["JSON", "Hashes", "Sets", "Lists", "Sorted sets", "GEO", "Search"],
  },
];

export async function integrationDashboard(client: Redis, config: CheckoutConfig, queues: CheckoutQueues) {
  const [products, queueCounts, vectorReady, textReady, logStreamLength, warehouseCount, trendingCount] = await Promise.all([
    listProducts(client),
    checkoutQueueCounts(queues),
    searchIndexReady(client, PRODUCT_VECTOR_INDEX),
    searchIndexReady(client, FULL_TEXT_INDEX),
    client.xlen("logs:app").catch(() => 0),
    client.zcard(WAREHOUSES_KEY).catch(() => 0),
    client.zcard("trending:global:24h").catch(() => 0),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    sourceDocs: ["HACKATHON.md", "Valkey-Integrations.md"],
    summary: {
      total: INTEGRATIONS.length,
      implemented: INTEGRATIONS.filter((integration) => integration.status === "implemented").length,
      configured: INTEGRATIONS.filter((integration) => integration.status === "configured").length,
      demoReady: INTEGRATIONS.filter((integration) => integration.status === "demo-ready").length,
      valkeyOnlyRuntime: true,
    },
    liveEvidence: {
      productCount: products.length,
      vectorIndexReady: vectorReady,
      fullTextIndexReady: textReady,
      queueCounts,
      logStreamLength: Number(logStreamLength) || 0,
      warehouseCount: Number(warehouseCount) || 0,
      trendingProductCount: Number(trendingCount) || 0,
      embeddingServiceUrl: config.embeddingServiceUrl,
      opensearchUrl: config.opensearchUrl,
      rateLimitRules: Object.keys(RATE_LIMIT_CONFIG).length,
    },
    integrations: INTEGRATIONS.map((integration) => ({
      ...integration,
      evidence: evidenceFor(integration.id, {
        productCount: products.length,
        queueCounts,
        vectorReady,
        textReady,
        logStreamLength: Number(logStreamLength) || 0,
        warehouseCount: Number(warehouseCount) || 0,
        trendingProductCount: Number(trendingCount) || 0,
        embeddingServiceUrl: config.embeddingServiceUrl,
        opensearchUrl: config.opensearchUrl,
      }),
    })),
  };
}

async function checkoutQueueCounts(queues: CheckoutQueues) {
  const entries = await Promise.all(
    Object.entries(queues).map(async ([name, queue]) => [name, await queue.getJobCounts("waiting", "active", "completed", "failed", "delayed")] as const)
  );
  return Object.fromEntries(entries);
}

async function searchIndexReady(client: Redis, indexName: string): Promise<boolean> {
  try {
    await client.call("FT.INFO", indexName);
    return true;
  } catch {
    return false;
  }
}

function evidenceFor(id: string, evidence: Record<string, unknown>) {
  switch (id) {
    case "bullmq-checkout":
      return { queueCounts: evidence.queueCounts };
    case "fastapi-embeddings":
      return { embeddingServiceUrl: evidence.embeddingServiceUrl, vectorIndexReady: evidence.vectorReady };
    case "valkey-vector-rag":
      return { vectorIndexReady: evidence.vectorReady, productCount: evidence.productCount };
    case "prometheus-analytics":
      return { metricsRoute: "/metrics", rateLimitRules: RATE_LIMIT_CONFIG.default.window };
    case "opensearch-observability":
      return { opensearchUrl: evidence.opensearchUrl, logStreamLength: evidence.logStreamLength };
    case "realtime-delivery":
      return { warehouseCount: evidence.warehouseCount, channelPattern: "delivery:location:{trackingId}" };
    case "rate-limiter":
      return { rateLimitRuleCount: Object.keys(RATE_LIMIT_CONFIG).length };
    case "ad-click-aggregation":
      return { trendingProductCount: evidence.trendingProductCount };
    case "agentic-memory":
      return { conversationKeyPattern: "conversation:{sessionId}", ttlSeconds: 1800 };
    case "ecommerce-core":
      return { productCount: evidence.productCount };
    default:
      return {};
  }
}
