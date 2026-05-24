import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();
const sessionId = "test-session";

test("catalog list returns products, facets, and cache metadata", async () => {
  const response = await request(app).get("/api/v1/products?limit=4").expect(200);

  assert.equal(response.body.data.length, 4);
  assert.ok(response.body.facets.categories.length > 0);
  assert.equal(response.body.cache.mode, "memory");
});

test("cart supports add, coupon, and calculated totals", async () => {
  await request(app)
    .post("/api/v1/cart/items")
    .set("x-session-id", sessionId)
    .send({ productId: "pulse-anc-earbuds-pro", quantity: 1 })
    .expect(201);

  const coupon = await request(app)
    .post("/api/v1/cart/coupon")
    .set("x-session-id", sessionId)
    .send({ code: "VALKEY10" })
    .expect(200);

  assert.equal(coupon.body.items.length, 1);
  assert.equal(coupon.body.coupon.code, "VALKEY10");
  assert.ok(coupon.body.totals.total > 0);
});

test("auth issues a token and protects admin analytics", async () => {
  const login = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "admin@valkeycommerce.dev", password: "Admin123!" })
    .expect(200);

  assert.ok(login.body.token);

  const analytics = await request(app)
    .get("/api/v1/admin/analytics")
    .set("Authorization", `Bearer ${login.body.token}`)
    .expect(200);

  assert.ok(analytics.body.data.productCount >= 30);
});
