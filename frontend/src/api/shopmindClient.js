import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shopmind_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const unwrap = (promise) => promise.then((response) => response.data.data ?? response.data);

export const shopmindApi = {
  login: (payload) => unwrap(api.post("/auth/login", payload)),
  register: (payload) => unwrap(api.post("/auth/register", payload)),
  products: (params) => unwrap(api.get("/products", { params })),
  product: (id) => unwrap(api.get(`/products/${id}`)),
  similar: (id) => unwrap(api.get(`/products/${id}/similar`)),
  categories: () => unwrap(api.get("/categories")),
  search: (params) => unwrap(api.get("/search", { params })),
  semanticSearch: (query) => unwrap(api.post("/search/semantic", { query })),
  aiSearch: (query, userId) => unwrap(api.post("/ai/search", { query, userId })),
  aiChat: (message, userId) => unwrap(api.post("/ai/chat", { message, userId })),
  insights: () => unwrap(api.get("/ai/analytics/insights")),
  cart: (params) => unwrap(api.get("/cart", { params })),
  addCartItem: (payload) => unwrap(api.post("/cart/items", payload)),
  applyCoupon: (payload) => unwrap(api.post("/cart/apply-coupon", payload)),
  cartRecommendations: (params) => unwrap(api.get("/cart/recommendations", { params })),
  checkout: (payload) => unwrap(api.post("/checkout/orders", payload)),
  orders: (params) => unwrap(api.get("/orders", { params })),
  order: (id) => unwrap(api.get(`/orders/${id}`)),
  inventory: (id) => unwrap(api.get(`/inventory/${id}`)),
  trending: () => unwrap(api.get("/trending")),
  recommendations: (params) => unwrap(api.get("/recommendations", { params })),
  notifications: (params) => unwrap(api.get("/notifications", { params })),
  delivery: (orderId) => unwrap(api.get(`/delivery/${orderId}`)),
  adminOverview: () => unwrap(api.get("/admin/analytics/overview")),
  adminProducts: () => unwrap(api.get("/admin/products")),
  enrichProduct: (id) => unwrap(api.post(`/ai/products/${id}/enrich`))
};
