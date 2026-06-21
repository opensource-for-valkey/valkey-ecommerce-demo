export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "ShopMind AI API",
    version: "1.0.0",
    description: "REST API for the Valkey-powered ShopMind AI commerce platform."
  },
  servers: [{ url: "http://localhost:4000/api" }],
  tags: [
    { name: "Auth" },
    { name: "Catalog" },
    { name: "Search" },
    { name: "AI" },
    { name: "Cart" },
    { name: "Checkout" },
    { name: "Realtime" },
    { name: "Admin" }
  ],
  paths: {
    "/auth/login": { post: { tags: ["Auth"], summary: "Login with email and password" } },
    "/auth/register": { post: { tags: ["Auth"], summary: "Create a customer account" } },
    "/products": { get: { tags: ["Catalog"], summary: "List products" } },
    "/products/{id}": { get: { tags: ["Catalog"], summary: "Get product detail" } },
    "/products/{id}/similar": { get: { tags: ["Search"], summary: "Vector similar products" } },
    "/search": { get: { tags: ["Search"], summary: "Keyword, fuzzy-style, category and brand search" } },
    "/search/autocomplete": { get: { tags: ["Search"], summary: "Autocomplete product names" } },
    "/search/semantic": { post: { tags: ["Search"], summary: "Semantic vector search" } },
    "/ai/search": { post: { tags: ["AI"], summary: "Agentic AI shopping search" } },
    "/ai/chat": { post: { tags: ["AI"], summary: "AI assistant chat" } },
    "/cart": { get: { tags: ["Cart"], summary: "Get smart cart" } },
    "/cart/items": { post: { tags: ["Cart"], summary: "Add item to cart" } },
    "/checkout/reserve": { post: { tags: ["Checkout"], summary: "Reserve inventory" } },
    "/checkout/orders": { post: { tags: ["Checkout"], summary: "Create order" } },
    "/inventory/{productId}": { get: { tags: ["Realtime"], summary: "Live inventory" } },
    "/trending": { get: { tags: ["Realtime"], summary: "Trending products from sorted sets" } },
    "/delivery/{orderId}": { get: { tags: ["Realtime"], summary: "GEO delivery tracking" } },
    "/admin/analytics/overview": { get: { tags: ["Admin"], summary: "Admin analytics overview" } }
  }
};
