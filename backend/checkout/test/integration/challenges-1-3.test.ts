import { type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createValkeyClient } from "../../src/connection";
import { CATEGORY_IDS, PRODUCT_FIXTURES, VENDOR_IDS } from "../../src/fixtures";
import { createCheckoutRuntime, type CheckoutRuntime } from "../../src/runtime";
import { PRODUCT_VECTOR_INDEX } from "../../src/search";
import { scanDelete } from "../../src/store";

const queuePrefix = `bull:checkout:challenge-1-3-test:${Date.now()}`;

let runtime: CheckoutRuntime;
let server: Server;
let baseUrl: string;
let client = createValkeyClient();

async function cleanup() {
  await client.call("FT.DROPINDEX", PRODUCT_VECTOR_INDEX).catch(() => undefined);
  await scanDelete(client, [
    "user:*",
    "email_user:*",
    "session:*",
    "user_sessions:*",
    "login_attempts:*",
    "cart:*",
    "cart_coupon:*",
    "coupon:*",
    "coupon_used:*",
    "category:*",
    "vendor:*",
    "category_products:*",
    "vendor_products:*",
    "brand_products:*",
    "price_index",
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

async function api(path: string, init: RequestInit & { token?: string; guestSessionId?: string } = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (init.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }
  if (init.guestSessionId) {
    headers.set("X-Guest-Session-Id", init.guestSessionId);
  }

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  return { response, body };
}

describe("Challenges 1, 2, and 3 APIs", () => {
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

  test("registers users, stores bcrypt hashes, creates sessions, and merges guest carts", async () => {
    const guestSessionId = `guest:test-${Date.now()}`;
    const guestCart = await api("/api/cart/items", {
      method: "POST",
      guestSessionId,
      body: JSON.stringify({ productId: PRODUCT_FIXTURES[0].id, quantity: 2 }),
    });
    expect(guestCart.response.status).toBe(201);
    expect(guestCart.body.cart.items).toHaveLength(1);

    const register = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "challenge-one@example.com",
        password: "ValkeyDemo123",
        firstName: "Challenge",
        lastName: "One",
        guestSessionId,
      }),
    });
    expect(register.response.status).toBe(201);
    expect(register.body.token).toBeTruthy();
    expect(register.body.user.email).toBe("challenge-one@example.com");
    expect(register.body.user.passwordHash).toBeUndefined();

    const rawHash = await client.call("JSON.GET", register.body.user.id, "$.passwordHash");
    expect(typeof rawHash).toBe("string");
    const passwordHash = JSON.parse(rawHash as string)[0] as string;
    expect(passwordHash).not.toBe("ValkeyDemo123");
    expect(passwordHash.startsWith("$2")).toBe(true);

    const me = await api("/api/auth/me", { token: register.body.token });
    expect(me.response.status).toBe(200);
    expect(me.body.user.id).toBe(register.body.user.id);

    const mergedCart = await api("/api/cart", { token: register.body.token });
    expect(mergedCart.response.status).toBe(200);
    expect(mergedCart.body.cart.items[0]).toMatchObject({ productId: PRODUCT_FIXTURES[0].id, quantity: 2 });

    const refresh = await api("/api/auth/refresh", { method: "POST", token: register.body.token });
    expect(refresh.response.status).toBe(200);
    expect(refresh.body.expiresIn).toBe(86400);

    const logout = await api("/api/auth/logout", { method: "POST", token: register.body.token });
    expect(logout.response.status).toBe(204);

    const afterLogout = await api("/api/auth/me", { token: register.body.token });
    expect(afterLogout.response.status).toBe(401);
  });

  test("limits repeated failed login attempts with expiring Valkey counters", async () => {
    const email = "locked-account@example.com";
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const login = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password: "wrong-password" }),
      });
      expect(login.response.status).toBe(attempt < 5 ? 401 : 429);
    }

    const attemptsTtl = await client.ttl("login_attempts:locked-account@example.com");
    expect(attemptsTtl).toBeGreaterThan(0);
  });

  test("serves category/vendor catalog filters with pagination from Valkey JSON", async () => {
    const categories = await api("/api/categories");
    expect(categories.response.status).toBe(200);
    expect(categories.body.categories.some((category: { childNodes: unknown[] }) => category.childNodes.length > 0)).toBe(true);

    const filtered = await api(
      `/api/products?categoryId=${encodeURIComponent(CATEGORY_IDS.workspace)}&minPrice=1000&maxPrice=3500&limit=2`
    );
    expect(filtered.response.status).toBe(200);
    expect(filtered.body.products).toHaveLength(2);
    expect(filtered.body.pagination.total).toBeGreaterThanOrEqual(2);
    expect(filtered.body.products.every((product: { price: { amount: number } }) => product.price.amount >= 1000 && product.price.amount <= 3500)).toBe(true);

    const vendorProducts = await api(`/api/vendors/${encodeURIComponent(VENDOR_IDS.teamDod)}/products?limit=10`);
    expect(vendorProducts.response.status).toBe(200);
    expect(vendorProducts.body.vendor.name).toBe("Team DoD Workspace");
    expect(vendorProducts.body.products.every((product: { vendorId: string }) => product.vendorId === VENDOR_IDS.teamDod)).toBe(true);
  });

  test("persists Valkey carts and prevents a logged-in user from reusing a coupon", async () => {
    const register = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "coupon-user@example.com",
        password: "ValkeyDemo123",
        firstName: "Coupon",
        lastName: "User",
      }),
    });
    expect(register.response.status).toBe(201);

    const add = await api("/api/cart/items", {
      method: "POST",
      token: register.body.token,
      body: JSON.stringify({ productId: PRODUCT_FIXTURES[0].id, quantity: 1 }),
    });
    expect(add.response.status).toBe(201);
    expect(add.body.cart.totals.subtotal).toBe(PRODUCT_FIXTURES[0].price.amount);

    const coupon = await api("/api/cart/coupon", {
      method: "POST",
      token: register.body.token,
      body: JSON.stringify({ code: "VALKEY10" }),
    });
    expect(coupon.response.status).toBe(200);
    expect(coupon.body.cart.coupon.code).toBe("VALKEY10");
    expect(coupon.body.cart.totals.discount).toBeGreaterThan(0);

    const remove = await api("/api/cart/coupon", { method: "DELETE", token: register.body.token });
    expect(remove.response.status).toBe(200);

    const reuse = await api("/api/cart/coupon", {
      method: "POST",
      token: register.body.token,
      body: JSON.stringify({ code: "VALKEY10" }),
    });
    expect(reuse.response.status).toBe(409);
    expect(reuse.body.error).toBe("coupon_not_applicable");
  });
});
