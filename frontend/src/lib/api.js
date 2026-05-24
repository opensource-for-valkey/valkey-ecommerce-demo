// Single fetch wrapper for the catalog API. Used by CategoryPage, ProductPage,
// CategoriesPage, SearchResultsPage, and home-page product modules. Keeps every
// surface speaking to the backend instead of local hardcoded data.

const BASE = process.env.REACT_APP_CATALOG_URL || "http://localhost:4000/api";

async function get(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, { ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

/** GET /api/categories → { items: [{slug,label,icon,tagline}] } */
export async function fetchCategories() {
  const j = await get("/categories");
  return j.items || [];
}

/** GET /api/products?category=&q=&sort=&pageSize=&page= */
export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.q) qs.set("q", params.q);
  if (params.brand) qs.set("brand", params.brand);
  if (params.sort) qs.set("sort", params.sort);
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params.page) qs.set("page", String(params.page));
  if (typeof params.minPrice === "number") qs.set("minPrice", String(params.minPrice));
  if (typeof params.maxPrice === "number") qs.set("maxPrice", String(params.maxPrice));
  if (params.tags && params.tags.length) qs.set("tags", params.tags.join(","));
  const j = await get(`/products?${qs.toString()}`);
  return j; // { items, total, page, pageSize, pages, facets }
}

/** GET /api/products/:id — id can be the productId ("product:00000101")
 *  or the short slugId ("oversized-blazer"). We try the short form first
 *  (the backend's catalog.getProduct accepts both via shortId stripping). */
export async function fetchProduct(idOrSlug) {
  // Backend's /api/products/:id resolves productId after stripping the
  // "product:" prefix. To accept slugIds, fall back to a category list scan.
  if (/^product:/.test(idOrSlug) || /^\d+$/.test(idOrSlug)) {
    return get(`/products/${encodeURIComponent(idOrSlug)}`);
  }
  // Slug lookup: pull all products, find by slugId / slug.
  const j = await fetchProducts({ pageSize: 200 });
  const items = j.items || [];
  return items.find((p) => p.slugId === idOrSlug || p.slug === idOrSlug || p.id === idOrSlug) || null;
}

/** GET /api/products/:id/similar */
export async function fetchSimilar(idOrSlug, limit = 6) {
  if (/^product:/.test(idOrSlug)) {
    const j = await get(`/products/${encodeURIComponent(idOrSlug)}/similar?limit=${limit}`);
    return j.items || [];
  }
  const p = await fetchProduct(idOrSlug);
  if (!p) return [];
  const j = await get(`/products/${encodeURIComponent(p.productId)}/similar?limit=${limit}`);
  return j.items || [];
}

/** GET /api/products/trending */
export async function fetchTrending({ category, limit = 8 } = {}) {
  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  qs.set("limit", String(limit));
  const j = await get(`/products/trending?${qs.toString()}`);
  return j.items || [];
}

export { BASE as API_BASE };
