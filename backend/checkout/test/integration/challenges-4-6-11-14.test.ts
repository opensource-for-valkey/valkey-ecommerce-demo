import { type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createValkeyClient } from "../../src/connection";
import { CATEGORY_IDS, PRODUCT_FIXTURES } from "../../src/fixtures";
import { FULL_TEXT_INDEX } from "../../src/engagement";
import { createCheckoutRuntime, type CheckoutRuntime } from "../../src/runtime";
import { PRODUCT_VECTOR_INDEX } from "../../src/search";
import { scanDelete } from "../../src/store";

const queuePrefix = `bull:checkout:challenge-4-14-test:${Date.now()}`;
const guestSessionId = `guest:challenge-4-14-${Date.now()}`;

let runtime: CheckoutRuntime;
let server: Server;
let baseUrl: string;
let client = createValkeyClient();

async function cleanup() {
  await client.call("FT.DROPINDEX", PRODUCT_VECTOR_INDEX).catch(() => undefined);
  await client.call("FT.DROPINDEX", FULL_TEXT_INDEX).catch(() => undefined);
  await scanDelete(client, [
    "product:*",
    "sku:*",
    "category:*",
    "vendor:*",
    "category_products:*",
    "vendor_products:*",
    "brand_products:*",
    "price_index",
    "coupon:*",
    "trending:*",
    "product_events:*",
    "ad:*",
    "ads:*",
    "ad_impressions:*",
    "ad_clicks:*",
    "ad_freq:*",
    "ad_spend:*",
    "autocomplete:*",
    "warehouses",
    "delivery_agents",
    "DEL-*",
    "ratelimit:*",
    "user_history:*",
    "user_affinity:*",
    "user_purchased:*",
    "copurchase:*",
    "conversation:*",
    "agent_feedback:*",
    "logs:app",
    "trace:*",
    `${queuePrefix}:*`,
  ]);
}

async function api(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-Guest-Session-Id", guestSessionId);
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  return { response, body };
}

describe("Challenges 4, 5, 6, 11, 12, 13, and 14 APIs", () => {
  beforeAll(async () => {
    await client.ping();
    await cleanup();
    runtime = await createCheckoutRuntime({
      ...process.env,
      AUTH_BCRYPT_ROUNDS: "4",
      CHECKOUT_QUEUE_PREFIX: queuePrefix,
      CHECKOUT_WORKER_CONCURRENCY: "2",
      CORS_ORIGIN: "http://localhost:3000,http://localhost:3001",
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

  test("tracks weighted trending events and full-text search facets", async () => {
    const product = PRODUCT_FIXTURES[0];
    await api("/api/events/view", { method: "POST", body: JSON.stringify({ productId: product.id, categoryId: product.categoryId }) });
    await api("/api/events/add-to-cart", { method: "POST", body: JSON.stringify({ productId: product.id, categoryId: product.categoryId }) });
    await api("/api/events/purchase", { method: "POST", body: JSON.stringify({ productId: product.id, categoryId: product.categoryId }) });

    const trending = await api("/api/trending?window=24h&limit=3");
    expect(trending.response.status).toBe(200);
    expect(trending.body.products[0].product.id).toBe(product.id);
    expect(trending.body.products[0].score).toBeGreaterThanOrEqual(9);

    const search = await api("/api/search?q=wireles%20keybord&pageSize=5");
    expect(search.response.status).toBe(200);
    expect(search.body.results[0].name).toContain("Keyboard");
    expect(search.body.facets.brands.length).toBeGreaterThan(0);

    const suggest = await api("/api/search/suggest?q=key");
    expect(suggest.response.status).toBe(200);
    expect(JSON.stringify(suggest.body.suggestions).toLowerCase()).toContain("keyboard");
  });

  test("serves targeted ads with impression, click, budget, and frequency stats", async () => {
    const ads = await api(`/api/ads?context=category&value=${encodeURIComponent(CATEGORY_IDS.input)}&limit=2&userId=user:ads`);
    expect(ads.response.status).toBe(200);
    expect(ads.body.ads.length).toBeGreaterThan(0);
    const adId = ads.body.ads[0].id as string;

    for (let count = 0; count < 3; count += 1) {
      const impression = await api(`/api/ads/${encodeURIComponent(adId)}/impression`, {
        method: "POST",
        body: JSON.stringify({ userId: "user:ads" }),
      });
      expect(impression.response.status).toBe(200);
    }
    const capped = await api(`/api/ads?context=category&value=${encodeURIComponent(CATEGORY_IDS.input)}&limit=3&userId=user:ads`);
    expect(capped.body.ads.map((ad: { id: string }) => ad.id)).not.toContain(adId);

    const click = await api(`/api/ads/${encodeURIComponent(adId)}/click`, { method: "POST", body: JSON.stringify({ userId: "user:ads" }) });
    expect(click.response.status).toBe(200);
    const stats = await api(`/api/ads/${encodeURIComponent(adId)}/stats`);
    expect(stats.body.impressions).toBe(3);
    expect(stats.body.clicks).toBe(1);
    expect(stats.body.ctr).toBeGreaterThan(0);
  });

  test("handles delivery serviceability, ETA, tracking, and location updates", async () => {
    const serviceability = await api("/api/delivery/check-serviceability?lat=17.43&lng=78.41");
    expect(serviceability.response.status).toBe(200);
    expect(serviceability.body.serviceable).toBe(true);
    expect(serviceability.body.nearestWarehouse.warehouseId).toBeTruthy();

    const eta = await api("/api/delivery/eta?from=17.4200%2C78.4200&to=17.4300%2C78.4100");
    expect(eta.response.status).toBe(200);
    expect(eta.body.etaMinutes).toBeGreaterThan(0);

    const update = await api("/api/delivery/DEL-HYD-TEAM-DOD/location", {
      method: "POST",
      body: JSON.stringify({ lat: 17.426, lng: 78.414, status: "in_transit" }),
    });
    expect(update.response.status).toBe(200);
    expect(update.body.tracking.history.length).toBeGreaterThan(2);
  });

  test("enforces the Valkey sliding-window rate limiter", async () => {
    const statuses = [];
    for (let count = 0; count < 4; count += 1) {
      statuses.push((await api("/api/ratelimit/test")).response.status);
    }
    expect(statuses.slice(0, 3)).toEqual([200, 200, 200]);
    expect(statuses[3]).toBe(429);
  });

  test("updates recommendations immediately from interaction events", async () => {
    const [first, second] = PRODUCT_FIXTURES;
    const view = await api("/api/recommendations/events", {
      method: "POST",
      body: JSON.stringify({ type: "view", productId: first.id }),
    });
    expect(view.response.status).toBe(200);

    const purchase = await api("/api/recommendations/events", {
      method: "POST",
      body: JSON.stringify({ type: "purchase", productIds: [first.id, second.id] }),
    });
    expect(purchase.response.status).toBe(200);

    const recent = await api("/api/recommendations/recently-viewed");
    expect(recent.body.results[0].id).toBe(first.id);

    const similar = await api(`/api/recommendations/similar/${encodeURIComponent(first.id)}`);
    expect(similar.body.results.map((product: { id: string }) => product.id)).toContain(second.id);

    const personalized = await api("/api/recommendations/personalized");
    expect(personalized.response.status).toBe(200);
    expect(Array.isArray(personalized.body.results)).toBe(true);
  });

  test("runs agentic search with Valkey conversation memory and feedback", async () => {
    const first = await api("/api/agent/search", {
      method: "POST",
      body: JSON.stringify({ message: "I need a travel gift under 3000" }),
    });
    expect(first.response.status).toBe(200);
    expect(first.body.sessionId).toBeTruthy();
    expect(first.body.results.length).toBeGreaterThan(0);

    const followUp = await api("/api/agent/search", {
      method: "POST",
      body: JSON.stringify({ sessionId: first.body.sessionId, message: "show me cheaper options" }),
    });
    expect(followUp.response.status).toBe(200);
    expect(followUp.body.context.turns).toBe(4);

    const conversation = await api(`/api/agent/conversation/${encodeURIComponent(first.body.sessionId)}`);
    expect(conversation.response.status).toBe(200);
    expect(conversation.body.turns.length).toBe(4);

    const feedback = await api("/api/agent/feedback", {
      method: "POST",
      body: JSON.stringify({ sessionId: first.body.sessionId, productId: first.body.results[0].productId, vote: "up" }),
    });
    expect(feedback.response.status).toBe(200);
  });

  test("exposes the unified integration dashboard with live Valkey evidence", async () => {
    const integrations = await api("/api/integrations");
    expect(integrations.response.status).toBe(200);
    expect(integrations.body.summary.total).toBeGreaterThanOrEqual(10);
    expect(integrations.body.summary.valkeyOnlyRuntime).toBe(true);
    expect(integrations.body.liveEvidence.productCount).toBe(PRODUCT_FIXTURES.length);
    expect(integrations.body.integrations.map((item: { id: string }) => item.id)).toContain("bullmq-checkout");
    expect(integrations.body.integrations.map((item: { id: string }) => item.id)).toContain("agentic-memory");
  });
});
