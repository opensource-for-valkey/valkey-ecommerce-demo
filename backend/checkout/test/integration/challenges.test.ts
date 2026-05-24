import { type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createValkeyClient } from "../../src/connection";
import { PRODUCT_FIXTURES } from "../../src/fixtures";
import { createCheckoutRuntime, type CheckoutRuntime } from "../../src/runtime";
import { PRODUCT_VECTOR_INDEX } from "../../src/search";
import { scanDelete, seedProducts } from "../../src/store";

const queuePrefix = `bull:checkout:challenge-test:${Date.now()}`;
const userId = "user:test-challenges";

let runtime: CheckoutRuntime;
let server: Server;
let baseUrl: string;
let client = createValkeyClient();

async function cleanup(cleanupClient = client) {
  await cleanupClient.call("FT.DROPINDEX", PRODUCT_VECTOR_INDEX).catch(() => undefined);
  await scanDelete(cleanupClient, [
    "order:*",
    "user_orders:*",
    "reservation:*",
    "idempotency:*",
    "idempotency_lock:*",
    "product:*",
    "sku:*",
    "stream:orders",
    "logs:app",
    "trace:*",
    "metrics:*",
    "active_users:*",
    `${queuePrefix}:*`,
  ]);
}

async function api(path: string, init: RequestInit & { auth?: boolean; idempotencyKey?: string } = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (init.auth) {
    headers.set("X-User-Id", userId);
  }
  if (init.idempotencyKey) {
    headers.set("Idempotency-Key", init.idempotencyKey);
  }

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  return { response, body };
}

describe("Challenges 7, 8, and 9 APIs", () => {
  beforeAll(async () => {
    await client.ping();
    await cleanup();
    await seedProducts(client);
    runtime = await createCheckoutRuntime({
      ...process.env,
      CHECKOUT_QUEUE_PREFIX: queuePrefix,
      CHECKOUT_WORKER_CONCURRENCY: "2",
      CORS_ORIGIN: "http://localhost:3000",
      EMBEDDING_SERVICE_URL: "local://deterministic",
      OPENSEARCH_URL: "http://127.0.0.1:9",
      RESERVATION_TTL_SECONDS: "30",
    });
    server = await runtime.start(0);
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("test server did not bind a TCP port");
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  }, 30000);

  afterAll(async () => {
    await runtime?.close();
    client.disconnect();
  }, 60000);

  test("exposes product catalog and semantic search with similar products", async () => {
    const products = await api("/api/products");
    expect(products.response.status).toBe(200);
    expect(products.body.products).toHaveLength(PRODUCT_FIXTURES.length);
    expect(products.response.headers.get("X-Trace-Id")).toBeTruthy();

    const search = await api("/api/search/semantic?q=typing%20keyboard&limit=5");
    expect(search.response.status).toBe(200);
    expect(search.body.results[0].product.name).toContain("Keyboard");
    expect(search.body.results[0].score).toBeGreaterThan(0);

    const similar = await api(`/api/products/${encodeURIComponent(search.body.results[0].product.id)}/similar`);
    expect(similar.response.status).toBe(200);
    expect(similar.body.results.length).toBeGreaterThan(0);
    expect(similar.body.results[0].product.id).not.toBe(search.body.results[0].product.id);
  });

  test("records analytics metrics and exposes Prometheus text", async () => {
    const start = await api("/api/checkout/start", {
      method: "POST",
      auth: true,
      idempotencyKey: "challenge-metrics-start",
      body: JSON.stringify({
        items: [{ productId: PRODUCT_FIXTURES[0].id, quantity: 1 }],
        shippingAddress: { city: "Hyderabad", country: "IN" },
      }),
    });
    expect(start.response.status).toBe(201);

    const payment = await api("/api/checkout/payment", {
      method: "POST",
      auth: true,
      idempotencyKey: "challenge-metrics-payment",
      body: JSON.stringify({ orderId: start.body.order.id, paymentInput: { outcome: "success" } }),
    });
    expect(payment.response.status).toBe(200);

    const confirm = await api("/api/checkout/confirm", {
      method: "POST",
      auth: true,
      idempotencyKey: "challenge-metrics-confirm",
      body: JSON.stringify({ orderId: start.body.order.id }),
    });
    expect(confirm.response.status).toBe(200);

    const dashboard = await api("/api/analytics/dashboard");
    expect(dashboard.response.status).toBe(200);
    expect(dashboard.body.dashboard.orders).toBeGreaterThanOrEqual(1);
    expect(dashboard.body.dashboard.revenue).toBeGreaterThan(0);
    expect(dashboard.body.dashboard.api.requests).toBeGreaterThan(0);

    const metrics = await fetch(`${baseUrl}/metrics`);
    const metricsText = await metrics.text();
    expect(metrics.status).toBe(200);
    expect(metricsText).toContain("valkey_ecommerce_orders_total");
    expect(metricsText).toContain("valkey_ecommerce_api_latency_ms");
  });

  test("captures traces, logs, errors, and CORS preflight", async () => {
    const preflight = await fetch(`${baseUrl}/api/products`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "GET",
      },
    });
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3000");

    const error = await api("/api/search/semantic");
    expect(error.response.status).toBe(400);
    const traceId = error.response.headers.get("X-Trace-Id");
    expect(traceId).toBeTruthy();

    await new Promise((resolve) => setTimeout(resolve, 50));

    const logs = await api("/api/observability/logs?limit=20");
    expect(logs.response.status).toBe(200);
    expect(logs.body.logs.some((log: { traceId: string | null }) => log.traceId === traceId)).toBe(true);

    const trace = await api(`/api/observability/traces/${traceId}`);
    expect(trace.response.status).toBe(200);
    expect(trace.body.logs.length).toBeGreaterThan(0);

    const errors = await api("/api/observability/errors");
    expect(errors.response.status).toBe(200);
    expect(errors.body.errors.length).toBeGreaterThan(0);

    const health = await api("/api/observability/health");
    expect(health.response.status).toBe(200);
    expect(health.body.health.stream.key).toBe("logs:app");
  });
});
