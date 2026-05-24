const API_BASE_URL = (process.env.REACT_APP_CHECKOUT_API_BASE_URL || "http://localhost:4000").replace(/\/$/, "");
const USER_ID_KEY = "valkey-demo-user-id";
const SESSION_TOKEN_KEY = "valkey-demo-session-token";
const GUEST_SESSION_KEY = "valkey-demo-guest-session-id";

export function getDemoUserId() {
  const existing = window.localStorage.getItem(USER_ID_KEY);
  if (existing) {
    return existing;
  }

  const userId = `user:demo:${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(USER_ID_KEY, userId);
  return userId;
}

export function apiBaseUrl() {
  return API_BASE_URL;
}

export function getSessionToken() {
  return window.localStorage.getItem(SESSION_TOKEN_KEY);
}

export function getGuestSessionId() {
  const existing = window.localStorage.getItem(GUEST_SESSION_KEY);
  if (existing) {
    return existing;
  }

  const guestSessionId = `guest:${cryptoRandomId()}`;
  window.localStorage.setItem(GUEST_SESSION_KEY, guestSessionId);
  return guestSessionId;
}

export async function registerAccount(input) {
  const data = await request("/api/auth/register", {
    method: "POST",
    body: { ...input, guestSessionId: getGuestSessionId() },
  });
  storeSession(data.token);
  return data;
}

export async function loginAccount(input) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: { ...input, guestSessionId: getGuestSessionId() },
  });
  storeSession(data.token);
  return data;
}

export async function logoutAccount() {
  try {
    await request("/api/auth/logout", { method: "POST", sessionAuth: true });
  } finally {
    clearSession();
  }
}

export async function getCurrentAccount() {
  return request("/api/auth/me", { sessionAuth: true });
}

export async function refreshAccountSession() {
  return request("/api/auth/refresh", { method: "POST", sessionAuth: true });
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
}

export async function getProducts(filters = {}) {
  const params = toSearchParams(filters);
  return request(`/api/products${params ? `?${params}` : ""}`);
}

export async function getCatalogProducts(filters = {}) {
  return getProducts(filters);
}

export async function getProduct(productId) {
  return request(`/api/products/${encodeURIComponent(productId)}`);
}

export async function getCategories() {
  return request("/api/categories");
}

export async function getVendors() {
  return request("/api/vendors");
}

export async function getVendorProducts(vendorId, filters = {}) {
  const params = toSearchParams(filters);
  return request(`/api/vendors/${encodeURIComponent(vendorId)}/products${params ? `?${params}` : ""}`);
}

export async function getCategoryProducts(categoryId, filters = {}) {
  const params = toSearchParams(filters);
  return request(`/api/categories/${encodeURIComponent(categoryId)}/products${params ? `?${params}` : ""}`);
}

export async function fullTextSearch(filters = {}) {
  const params = toSearchParams(filters);
  return request(`/api/search${params ? `?${params}` : ""}`);
}

export async function searchSuggestions(query) {
  return request(`/api/search/suggest?q=${encodeURIComponent(query)}`);
}

export async function getTrending(filters = {}) {
  const params = toSearchParams(filters);
  return request(`/api/trending${params ? `?${params}` : ""}`);
}

export async function recordProductEvent(type, productId, categoryId) {
  const path = type === "purchase" ? "/api/events/purchase" : type === "add_to_cart" ? "/api/events/add-to-cart" : "/api/events/view";
  return request(path, { method: "POST", body: { productId, categoryId } });
}

export async function getAds(filters = {}) {
  const params = toSearchParams(filters);
  return request(`/api/ads${params ? `?${params}` : ""}`, { cart: true });
}

export async function recordAdImpression(adId) {
  return request(`/api/ads/${encodeURIComponent(adId)}/impression`, { method: "POST", cart: true, body: {} });
}

export async function recordAdClick(adId) {
  return request(`/api/ads/${encodeURIComponent(adId)}/click`, { method: "POST", cart: true, body: {} });
}

export async function checkDeliveryServiceability(lat, lng) {
  return request(`/api/delivery/check-serviceability?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`);
}

export async function getDeliveryEta(from, to) {
  return request(`/api/delivery/eta?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}

export async function getDeliveryTracking(trackingId) {
  return request(`/api/delivery/${encodeURIComponent(trackingId)}`);
}

export async function updateDeliveryLocation(trackingId, input) {
  return request(`/api/delivery/${encodeURIComponent(trackingId)}/location`, { method: "POST", body: input });
}

export async function getRateLimitConfig() {
  return request("/api/ratelimit/config");
}

export async function hitRateLimitDemo() {
  return request("/api/ratelimit/test");
}

export async function recordRecommendationEvent(input) {
  return request("/api/recommendations/events", { method: "POST", cart: true, body: input });
}

export async function getPersonalizedRecommendations() {
  return request("/api/recommendations/personalized", { cart: true });
}

export async function getRecentlyViewed() {
  return request("/api/recommendations/recently-viewed", { cart: true });
}

export async function getTrendingForYou() {
  return request("/api/recommendations/trending-for-you", { cart: true });
}

export async function agentSearch(input) {
  return request("/api/agent/search", { method: "POST", body: input });
}

export async function getIntegrationsDashboard() {
  return request("/api/integrations");
}

export async function semanticSearch({ query, categoryId, minPrice, maxPrice, limit = 8 }) {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  if (categoryId) params.set("categoryId", categoryId);
  if (minPrice) params.set("minPrice", String(minPrice));
  if (maxPrice) params.set("maxPrice", String(maxPrice));
  return request(`/api/search/semantic?${params.toString()}`);
}

export async function similarProducts(productId, limit = 4) {
  return request(`/api/products/${encodeURIComponent(productId)}/similar?limit=${limit}`);
}

export async function startCheckout({ items, shippingAddress }) {
  return request("/api/checkout/start", {
    method: "POST",
    auth: true,
    idempotencyKey: uniqueKey("checkout-start"),
    body: { items, shippingAddress },
  });
}

export async function authorizePayment({ orderId, outcome }) {
  return request("/api/checkout/payment", {
    method: "POST",
    auth: true,
    idempotencyKey: uniqueKey("checkout-payment"),
    body: { orderId, paymentInput: { outcome } },
  });
}

export async function confirmCheckout({ orderId }) {
  return request("/api/checkout/confirm", {
    method: "POST",
    auth: true,
    idempotencyKey: uniqueKey("checkout-confirm"),
    body: { orderId },
  });
}

export async function cancelCheckout({ orderId }) {
  return request("/api/checkout/cancel", {
    method: "POST",
    auth: true,
    body: { orderId },
  });
}

export async function getOrders() {
  return request("/api/orders", { auth: true });
}

export async function getCart() {
  return request("/api/cart", { cart: true });
}

export async function addCartItem(productId, quantity = 1) {
  return request("/api/cart/items", {
    method: "POST",
    cart: true,
    body: { productId, quantity },
  });
}

export async function updateCartItem(productId, quantity) {
  return request(`/api/cart/items/${encodeURIComponent(productId)}`, {
    method: "PATCH",
    cart: true,
    body: { quantity },
  });
}

export async function removeCartItem(productId) {
  return request(`/api/cart/items/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    cart: true,
  });
}

export async function clearCartApi() {
  return request("/api/cart", {
    method: "DELETE",
    cart: true,
  });
}

export async function applyCartCoupon(code) {
  return request("/api/cart/coupon", {
    method: "POST",
    cart: true,
    body: { code },
  });
}

export async function removeCartCoupon() {
  return request("/api/cart/coupon", {
    method: "DELETE",
    cart: true,
  });
}

export async function getAnalyticsDashboard() {
  return request("/api/analytics/dashboard");
}

export async function getPrometheusMetrics() {
  const response = await fetch(`${API_BASE_URL}/metrics`);
  return response.text();
}

export async function getObservabilityHealth() {
  return request("/api/observability/health");
}

export async function getObservabilityLogs(limit = 100) {
  return request(`/api/observability/logs?limit=${limit}`);
}

export async function getObservabilityErrors() {
  return request("/api/observability/errors");
}

export async function getTrace(traceId) {
  return request(`/api/observability/traces/${encodeURIComponent(traceId)}`);
}

export async function triggerDemoError() {
  return request("/api/search/semantic");
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth || options.sessionAuth || options.cart) {
    const token = getSessionToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else if (options.cart) {
      headers.set("X-Guest-Session-Id", getGuestSessionId());
    } else if (options.auth) {
      headers.set("X-User-Id", getDemoUserId());
    }
  }
  if (options.idempotencyKey) {
    headers.set("Idempotency-Key", options.idempotencyKey);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const traceId = response.headers.get("X-Trace-Id");
  const contentType = response.headers.get("Content-Type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(body?.message || `API request failed with ${response.status}`);
    error.status = response.status;
    error.code = body?.error;
    error.details = body?.details;
    error.traceId = traceId;
    throw error;
  }

  return typeof body === "object" && body !== null ? { ...body, traceId } : { body, traceId };
}

function uniqueKey(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function storeSession(token) {
  if (token) {
    window.localStorage.setItem(SESSION_TOKEN_KEY, token);
  }
}

function toSearchParams(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (key === "attributes" && typeof value === "object") {
      Object.entries(value).forEach(([attributeKey, attributeValue]) => {
        if (attributeValue !== undefined && attributeValue !== null && attributeValue !== "") {
          params.set(`attribute.${attributeKey}`, String(attributeValue));
        }
      });
      return;
    }

    params.set(key, String(value));
  });
  return params.toString();
}

function cryptoRandomId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
