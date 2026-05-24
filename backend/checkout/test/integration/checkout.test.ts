import { type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createValkeyClient } from "../../src/connection";
import { PRODUCT_FIXTURES } from "../../src/fixtures";
import { createCheckoutRuntime, type CheckoutRuntime } from "../../src/runtime";
import { PRODUCT_VECTOR_INDEX } from "../../src/search";
import { getProduct, scanDelete, seedProducts } from "../../src/store";

const userId = "user:test-checkout";
const queuePrefix = `bull:checkout:test:${Date.now()}`;

let runtime: CheckoutRuntime;
let server: Server;
let baseUrl: string;
let client = createValkeyClient();

async function cleanup() {
  await client.call("FT.DROPINDEX", PRODUCT_VECTOR_INDEX).catch(() => undefined);
  await scanDelete(client, [
    "order:*",
    "user_orders:*",
    "reservation:*",
    "idempotency:*",
    "idempotency_lock:*",
    "product:*",
    "sku:*",
    "stream:orders",
    `${queuePrefix}:*`,
  ]);
}

async function api(path: string, init: RequestInit & { idempotencyKey?: string } = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-User-Id", userId);
  if (init.idempotencyKey) {
    headers.set("Idempotency-Key", init.idempotencyKey);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });
  const body = await response.json();
  return { response, body };
}

describe("BullMQ checkout backed by Valkey", () => {
  beforeAll(async () => {
    await client.ping();
    await cleanup();
    await seedProducts(client);

    runtime = await createCheckoutRuntime({
      ...process.env,
      CHECKOUT_QUEUE_PREFIX: queuePrefix,
      CHECKOUT_WORKER_CONCURRENCY: "2",
      EMBEDDING_SERVICE_URL: "local://deterministic",
      OPENSEARCH_URL: "http://127.0.0.1:9",
      RATE_LIMIT_ENABLED: "false",
      RESERVATION_TTL_SECONDS: "30",
    });
    server = await runtime.start(0);
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("test server did not bind a TCP port");
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  }, 20000);

  afterAll(async () => {
    await runtime?.close();
    client.disconnect();
  }, 20000);

  test("runs checkout from reservation to confirmation without overselling", async () => {
    const product = PRODUCT_FIXTURES[0];
    const before = await getProduct(client, product.id);
    expect(before?.inventory).toMatchObject({ quantity: 25, reserved: 0 });

    const start = await api("/api/checkout/start", {
      method: "POST",
      idempotencyKey: "full-flow-start",
      body: JSON.stringify({
        items: [{ productId: product.id, quantity: 2 }],
        shippingAddress: { city: "Hyderabad", country: "IN" },
      }),
    });

    expect(start.response.status).toBe(201);
    expect(start.body.order.status).toBe("pending_payment");
    const orderId = start.body.order.id as string;

    const replay = await api("/api/checkout/start", {
      method: "POST",
      idempotencyKey: "full-flow-start",
      body: JSON.stringify({
        items: [{ productId: product.id, quantity: 2 }],
        shippingAddress: { city: "Hyderabad", country: "IN" },
      }),
    });
    expect(replay.response.status).toBe(201);
    expect(replay.body.order.id).toBe(orderId);

    const payment = await api("/api/checkout/payment", {
      method: "POST",
      idempotencyKey: "full-flow-payment",
      body: JSON.stringify({ orderId, paymentInput: { outcome: "success" } }),
    });
    expect(payment.response.status).toBe(200);
    expect(payment.body.order.status).toBe("payment_authorized");

    const confirm = await api("/api/checkout/confirm", {
      method: "POST",
      idempotencyKey: "full-flow-confirm",
      body: JSON.stringify({ orderId }),
    });
    expect(confirm.response.status).toBe(200);
    expect(confirm.body.order.status).toBe("confirmed");

    const after = await getProduct(client, product.id);
    expect(after?.inventory).toMatchObject({ quantity: 23, reserved: 0 });

    const list = await api("/api/orders", { method: "GET" });
    expect(list.response.status).toBe(200);
    expect(list.body.orders.map((order: { id: string }) => order.id)).toContain(orderId);
  });

  test("rejects requests without the auth header", async () => {
    const response = await fetch(`${baseUrl}/api/orders`);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("unauthorized");
  });

  test("requires idempotency keys on side-effecting checkout endpoints", async () => {
    const product = PRODUCT_FIXTURES[3];
    const response = await api("/api/checkout/start", {
      method: "POST",
      body: JSON.stringify({
        items: [{ productId: product.id, quantity: 1 }],
        shippingAddress: { city: "Hyderabad", country: "IN" },
      }),
    });

    expect(response.response.status).toBe(400);
    expect(response.body.error).toBe("missing_idempotency_key");
  });

  test("rejects reservation when requested quantity exceeds available stock", async () => {
    const product = PRODUCT_FIXTURES[1];
    const response = await api("/api/checkout/start", {
      method: "POST",
      idempotencyKey: "insufficient-stock-start",
      body: JSON.stringify({
        items: [{ productId: product.id, quantity: 999 }],
        shippingAddress: { city: "Hyderabad", country: "IN" },
      }),
    });

    expect(response.response.status).toBe(409);
    expect(response.body.error).toBe("insufficient_stock");

    const storedProduct = await getProduct(client, product.id);
    expect(storedProduct?.inventory).toMatchObject({ quantity: 30, reserved: 0 });
  });

  test("rejects confirmation before payment authorization", async () => {
    const product = PRODUCT_FIXTURES[3];
    const start = await api("/api/checkout/start", {
      method: "POST",
      idempotencyKey: "invalid-confirm-start",
      body: JSON.stringify({
        items: [{ productId: product.id, quantity: 1 }],
        shippingAddress: { city: "Hyderabad", country: "IN" },
      }),
    });
    expect(start.response.status).toBe(201);
    const orderId = start.body.order.id as string;

    const confirm = await api("/api/checkout/confirm", {
      method: "POST",
      idempotencyKey: "invalid-confirm-confirm",
      body: JSON.stringify({ orderId }),
    });

    expect(confirm.response.status).toBe(409);
    expect(confirm.body.error).toBe("invalid_order_state");

    await api("/api/checkout/cancel", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    });
  });

  test("declines payment deterministically and releases inventory on cancel", async () => {
    const product = PRODUCT_FIXTURES[4];
    const start = await api("/api/checkout/start", {
      method: "POST",
      idempotencyKey: "decline-flow-start",
      body: JSON.stringify({
        items: [{ productId: product.id, quantity: 2 }],
        shippingAddress: { city: "Hyderabad", country: "IN" },
      }),
    });
    expect(start.response.status).toBe(201);
    const orderId = start.body.order.id as string;

    const declined = await api("/api/checkout/payment", {
      method: "POST",
      idempotencyKey: "decline-flow-payment",
      body: JSON.stringify({ orderId, paymentInput: { outcome: "decline" } }),
    });
    expect(declined.response.status).toBe(402);
    expect(declined.body.order.status).toBe("payment_failed");

    const reservedProduct = await getProduct(client, product.id);
    expect(reservedProduct?.inventory).toMatchObject({ quantity: 20, reserved: 2 });

    const cancel = await api("/api/checkout/cancel", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    });
    expect(cancel.response.status).toBe(200);
    expect(cancel.body.order.status).toBe("cancelled");

    const releasedProduct = await getProduct(client, product.id);
    expect(releasedProduct?.inventory).toMatchObject({ quantity: 20, reserved: 0 });
  });

  test("cancels a pending order and releases reserved inventory", async () => {
    const product = PRODUCT_FIXTURES[2];
    const start = await api("/api/checkout/start", {
      method: "POST",
      idempotencyKey: "cancel-flow-start",
      body: JSON.stringify({
        items: [{ productId: product.id, quantity: 3 }],
        shippingAddress: { city: "Hyderabad", country: "IN" },
      }),
    });
    expect(start.response.status).toBe(201);
    const orderId = start.body.order.id as string;

    const reservedProduct = await getProduct(client, product.id);
    expect(reservedProduct?.inventory).toMatchObject({ quantity: 18, reserved: 3 });

    const cancel = await api("/api/checkout/cancel", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    });
    expect(cancel.response.status).toBe(200);
    expect(cancel.body.order.status).toBe("cancelled");

    const releasedProduct = await getProduct(client, product.id);
    expect(releasedProduct?.inventory).toMatchObject({ quantity: 18, reserved: 0 });
  });
});
