import request from "supertest";
import { createApp } from "../src/app.js";
import { authService } from "../src/services/auth.service.js";
import { valkey } from "../src/services/valkey.service.js";

await valkey.connect();
await authService.init();

const app = createApp();
const sessionId = `smoke-${Date.now()}`;

const health = await request(app).get("/api/v1/health").expect(200);
const products = await request(app).get("/api/v1/products?limit=3").expect(200);
await request(app)
  .post("/api/v1/cart/items")
  .set("x-session-id", sessionId)
  .send({ productId: products.body.data[0].id, quantity: 1 })
  .expect(201);
const cart = await request(app).get("/api/v1/cart").set("x-session-id", sessionId).expect(200);

console.log(
  JSON.stringify(
    {
      health: health.body.status,
      valkeyMode: health.body.valkey.mode,
      products: products.body.data.length,
      cartItems: cart.body.items.length,
      cartTotal: cart.body.totals.total
    },
    null,
    2
  )
);

await valkey.disconnect();
