const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

const getSessionId = () => {
  const existing = window.localStorage.getItem("vc_session_id");
  if (existing) return existing;
  const next = `guest-${
    window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now()
  }`;
  window.localStorage.setItem("vc_session_id", next);
  return next;
};

let authToken = window.localStorage.getItem("vc_token");

export const setAuthToken = (token) => {
  authToken = token;
  if (token) window.localStorage.setItem("vc_token", token);
  else window.localStorage.removeItem("vc_token");
};

export const api = {
  async request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-session-id": getSessionId(),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {})
      }
    });

    if (response.status === 204) return null;

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload?.error?.message || "Something went wrong";
      throw new Error(message);
    }
    return payload;
  },

  products(query = {}) {
    const search = new URLSearchParams(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== "")
    );
    return this.request(`/products?${search.toString()}`);
  },

  product(id) {
    return this.request(`/products/${id}`);
  },

  suggestions(q) {
    return this.request(`/products/suggestions?q=${encodeURIComponent(q)}`);
  },

  trending(limit = 6) {
    return this.request(`/products/trending?limit=${limit}`);
  },

  recentlyViewed() {
    return this.request("/products/recently-viewed");
  },

  cart() {
    return this.request("/cart");
  },

  addCartItem(productId, quantity = 1, variantId) {
    return this.request("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, variantId })
    });
  },

  updateCartItem(productId, quantity, variantId) {
    return this.request(`/cart/items/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity, variantId })
    });
  },

  removeCartItem(productId, variantId) {
    const suffix = variantId ? `?variantId=${encodeURIComponent(variantId)}` : "";
    return this.request(`/cart/items/${productId}${suffix}`, { method: "DELETE" });
  },

  applyCoupon(code) {
    return this.request("/cart/coupon", {
      method: "POST",
      body: JSON.stringify({ code })
    });
  },

  clearCart() {
    return this.request("/cart", { method: "DELETE" });
  },

  wishlist() {
    return this.request("/wishlist");
  },

  addWishlist(productId) {
    return this.request(`/wishlist/${productId}`, { method: "POST" });
  },

  removeWishlist(productId) {
    return this.request(`/wishlist/${productId}`, { method: "DELETE" });
  },

  login(payload) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  register(payload) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  me() {
    return this.request("/auth/me");
  },

  updateMe(payload) {
    return this.request("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  },

  logout() {
    return this.request("/auth/logout", { method: "POST" });
  },

  checkout(payload) {
    return this.request("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  orders() {
    return this.request("/orders");
  },

  analytics() {
    return this.request("/admin/analytics");
  },

  updateInventory(productId, delta) {
    return this.request(`/admin/inventory/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ delta })
    });
  },

  health() {
    return this.request("/health");
  }
};
