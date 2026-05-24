// Mock catalogue — mirrors the Nocturne & Co. data in
// frontend/src/data/products.js so the fallback path (backend down / empty)
// surfaces the same items the rest of the app expects.

import { CATEGORIES, PRODUCTS } from "../data/products";

const flickr = (q) => `https://loremflickr.com/600/600/${encodeURIComponent(q)}`;

const PHOSPHOR_ICONS = {
  "fashion": "ph-coat-hanger",
  "gaming": "ph-game-controller",
  "study-setup": "ph-desk",
  "tech-accessories": "ph-plugs-connected",
  "footwear": "ph-sneaker",
  "streetwear": "ph-baseball-cap",
  "gift-ideas": "ph-gift",
  "monochrome-collection": "ph-circle-half",
};

const parsePrice = (p) => Number(String(p || "").replace(/[^\d.]/g, "")) || 0;

export const MOCK_CATEGORIES = CATEGORIES.map((c) => ({
  slug: c.slug,
  label: c.label,
  tagline: c.tagline,
  icon: PHOSPHOR_ICONS[c.slug] || "ph-circle",
}));

export const MOCK_PRODUCTS = PRODUCTS.map((p, idx) => {
  const price = parsePrice(p.price);
  const oldPrice = parsePrice(p.oldPrice);
  const main = flickr(`${p.name} ${p.category}`);
  return {
    productId: `product:mock-${String(idx + 1).padStart(8, "0")}`,
    name: p.name,
    subtitle: p.subtitle,
    slug: p.id,
    category: p.category,
    brand: "Nocturne & Co.",
    vendor: "Maison Nocturne",
    price,
    originalPrice: oldPrice || +(price * 1.2).toFixed(2),
    currency: "GBP",
    rating: 4.6 + ((idx * 13) % 4) / 10,
    reviewCount: 200 + ((idx * 53) % 1500),
    stock: 12 + ((idx * 7) % 80),
    inStock: true,
    tags: [p.category, ...(p.name.toLowerCase().split(/\s+/))].slice(0, 6),
    image: main,
    images: [main, flickr(`${p.name} detail`), flickr(`${p.category} flatlay`)],
    description: p.description,
    badge: p.badge,
    shape: p.shape,
  };
});

export function mockFilter({ category, q, minPrice, maxPrice, sort = "relevance", limit = 24 } = {}) {
  let items = MOCK_PRODUCTS.slice();
  if (category) items = items.filter((p) => p.category === category);
  if (typeof minPrice === "number") items = items.filter((p) => p.price >= minPrice);
  if (typeof maxPrice === "number") items = items.filter((p) => p.price <= maxPrice);
  if (q) {
    const STOP = new Set(["a","an","the","and","or","for","to","of","with","in","on","at","under","below","over","above","about","my","please","find","show","best","top","need","want","some","any","items","item","i"]);
    const toks = q.toLowerCase().split(/[^a-z0-9-]+/).filter((t) => t && !STOP.has(t) && !/^\d+$/.test(t));
    if (toks.length) {
      items = items.filter((p) => {
        const hay = `${p.name} ${p.category} ${p.brand} ${(p.tags || []).join(" ")} ${p.description || ""} ${p.subtitle || ""}`.toLowerCase();
        return toks.some((t) => hay.includes(t));
      });
    }
  }
  const sorters = {
    "price-asc":  (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "rating":     (a, b) => b.rating - a.rating,
    "relevance":  (a, b) => b.rating - a.rating,
  };
  items.sort(sorters[sort] || sorters.relevance);
  return { items: items.slice(0, limit), total: items.length };
}

const CAT_KW = {
  fashion:                ["fashion", "blazer", "shirt", "trouser", "pants", "linen", "knit", "tailored"],
  gaming:                 ["gaming", "keyboard", "mouse", "mousepad", "headset", "monitor arm", "rgb"],
  "study-setup":          ["study", "desk", "lamp", "chair", "shelf", "monitor stand", "blotter", "workspace"],
  "tech-accessories":     ["tech", "cable", "usb-c", "hub", "stylus", "screen cloth", "accessory"],
  footwear:               ["shoe", "shoes", "sneaker", "loafer", "derby", "boot", "slipper", "footwear"],
  streetwear:             ["streetwear", "hoodie", "tee", "track jacket", "cap", "cross-body", "bag"],
  "gift-ideas":           ["gift", "present", "candle", "tea", "incense", "writing set"],
  "monochrome-collection":["monochrome", "all black", "cashmere", "scarf", "flannel", "minimal"],
};

export function parseNL(q) {
  const t = (q || "").toLowerCase();
  let category;
  for (const [cat, kws] of Object.entries(CAT_KW)) {
    if (kws.some((k) => t.includes(k))) { category = cat; break; }
  }
  let minPrice, maxPrice;
  let m = t.match(/(?:between|from)\s*[£$]?\s*(\d{1,6})\s*(?:and|to|-)\s*[£$]?\s*(\d{1,6})/);
  if (m) { minPrice = +m[1]; maxPrice = +m[2]; }
  m = t.match(/(?:under|below|less than)\s*[£$]?\s*(\d{1,6})/);
  if (m) maxPrice = +m[1];
  m = t.match(/(?:over|above|more than)\s*[£$]?\s*(\d{1,6})/);
  if (m) minPrice = +m[1];
  return { category, minPrice, maxPrice };
}
