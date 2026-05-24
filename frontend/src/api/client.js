// Thin REST client for the local Node + SQLite backend.
//
// Base URL is read from REACT_APP_API_URL (CRA env convention).
// Default to http://localhost:4000 so things "just work" with `npm start` in
// both apps.

const BASE_URL = (
    process.env.REACT_APP_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

function buildQuery(params) {
    if (!params) return "";
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === "") continue;
        usp.append(k, String(v));
    }
    const s = usp.toString();
    return s ? `?${s}` : "";
}

async function request(path, { params, signal, method, body } = {}) {
    const url = `${BASE_URL}${path}${buildQuery(params)}`;
    const init = {
        signal,
        credentials: "include",
        method: method || (body ? "POST" : "GET"),
        headers: {},
    };
    if (body !== undefined) {
        init.headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(body);
    }
    const res = await fetch(url, init);
    if (res.status === 204) return null;
    if (!res.ok) {
        let payload = null;
        try {
            payload = await res.json();
        } catch {
            /* non-JSON error body */
        }
        const err = new Error(
            (payload && payload.message) || `${res.status} ${res.statusText}`
        );
        err.status = res.status;
        err.code = payload?.error;
        err.body = payload;
        throw err;
    }
    return res.json();
}

export const api = {
    baseUrl: BASE_URL,
    health: (opts) => request("/api/health", opts),
    listProducts: (params, opts) => request("/api/products", { ...opts, params }),
    getProduct: (id, opts) => request(`/api/products/${encodeURIComponent(id)}`, opts),
    listCategories: (opts) => request("/api/categories", opts),
    productsByCategory: (id, params, opts) =>
        request(`/api/categories/${encodeURIComponent(id)}/products`, { ...opts, params }),
    listVendors: (opts) => request("/api/vendors", opts),
    getVendor: (id, opts) => request(`/api/vendors/${encodeURIComponent(id)}`, opts),
    search: (params, opts) => request("/api/search", { ...opts, params }),
    suggest: (params, opts) => request("/api/search/suggest", { ...opts, params }),

    // Auth
    register: (body, opts) =>
        request("/api/auth/register", { ...opts, method: "POST", body }),
    login: (body, opts) =>
        request("/api/auth/login", { ...opts, method: "POST", body }),
    logout: (opts) => request("/api/auth/logout", { ...opts, method: "POST", body: {} }),
    me: (opts) => request("/api/auth/me", opts),

    // Cart
    getCart: (opts) => request("/api/cart", opts),
    addCartItem: (body, opts) =>
        request("/api/cart/items", { ...opts, method: "POST", body }),
    updateCartItem: (productId, body, opts) =>
        request(`/api/cart/items/${encodeURIComponent(productId)}`, {
            ...opts,
            method: "PATCH",
            body,
        }),
    removeCartItem: (productId, opts) =>
        request(`/api/cart/items/${encodeURIComponent(productId)}`, {
            ...opts,
            method: "DELETE",
        }),
    clearCart: (opts) => request("/api/cart", { ...opts, method: "DELETE" }),

    // Agent / chat
    listMessages: (params, opts) =>
        request("/api/agent/messages", { ...opts, params }),
    sendChat: (body, opts) =>
        request("/api/agent/chat", { ...opts, method: "POST", body }),
    clearMessages: (opts) =>
        request("/api/agent/messages", { ...opts, method: "DELETE" }),
};

export default api;
