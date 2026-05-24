// Catalog query layer — uses Valkey indexes for fast filtered queries.
// Re-used by the /api/* product routes AND by the agent tools (search_products,
// find_similar, etc.) so there is one source of truth for catalog logic.

const crypto = require('crypto');
const { client, jsonGet } = require('../valkey/client');
const keys = require('../valkey/keys');
const config = require('../config');
const productService = require('./product.service');
const { categories: CATEGORY_META } = require('../data/categories');

function hashKey(obj) {
  return crypto.createHash('sha1').update(JSON.stringify(obj)).digest('hex').slice(0, 16);
}

async function cacheGet(key) {
  const raw = await client.get(keys.apiCache(key));
  return raw ? JSON.parse(raw) : null;
}
async function cacheSet(key, value, ttl = config.agentCacheTtl) {
  await client.set(keys.apiCache(key), JSON.stringify(value), 'EX', ttl);
}

function shortId(productId) {
  return String(productId).replace(/^product:/, '');
}
async function loadProducts(ids) {
  if (!ids || ids.length === 0) return [];
  const docs = await Promise.all(ids.map((id) => jsonGet(keys.product(shortId(id)))));
  return docs.filter(Boolean);
}

async function listCategories() {
  return CATEGORY_META;
}

// ────────────────────────────────────────────────────────────────────
// Generic product query (used by /api/products and /api/search)
// ────────────────────────────────────────────────────────────────────
async function queryProducts(opts = {}) {
  const {
    q = '',
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    color,
    inStock,
    tags = [],
    sort = 'relevance',
    page = 1,
    pageSize = 24,
  } = opts;

  const cacheKey = hashKey({ q, category, brand, minPrice, maxPrice, minRating, color, inStock, tags, sort, page, pageSize });
  const cached = await cacheGet(cacheKey);
  if (cached) return { ...cached, cached: true };

  // 1. Candidate id set — narrow as much as possible via Valkey indexes.
  let candidateIds = null;

  if (category) {
    // Price range filter using ZSET — far faster than scanning all products.
    const lo = typeof minPrice === 'number' ? minPrice : '-inf';
    const hi = typeof maxPrice === 'number' ? maxPrice : '+inf';
    candidateIds = await client.zrangebyscore(keys.pricesByCategory(category), lo, hi);
  } else if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
    const lo = typeof minPrice === 'number' ? minPrice : '-inf';
    const hi = typeof maxPrice === 'number' ? maxPrice : '+inf';
    candidateIds = await client.zrangebyscore(keys.pricesGlobal, lo, hi);
  } else {
    candidateIds = await client.smembers(keys.productIndex);
  }

  // Intersect with brand
  if (brand) {
    const brandSlug = String(brand).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const brandIds = new Set(await client.smembers(keys.brand(brandSlug)));
    candidateIds = candidateIds.filter((id) => brandIds.has(id));
  }

  // Hydrate
  let products = await loadProducts(candidateIds);

  // Free-text / tag / rating / color / stock filters in memory (small N).
  const STOP = new Set(['a','an','the','and','or','for','to','of','with','in','on','at','under','below','over','above','about','my','please','find','show','best','top','need','want','some','any','that','this','i','me','us','we','you','your','our','as','is','it','be','do','can','will','would','should','also','just','really','very','one','two','buy','get','give','have','from','into','out','off','up','down','they','them','he','she','his','her','its']);
  const qNorm = q.trim().toLowerCase();
  const qTokens = qNorm
    .split(/[^a-z0-9-]+/)
    // Short tokens ("me", "is", "to") match substrings of unrelated product
    // text. Require ≥3 chars and skip pure digits.
    .filter((t) => t && t.length >= 3 && !STOP.has(t) && !/^\d+$/.test(t));
  if (qTokens.length) {
    products = products.filter((p) => {
      const hay = `${p.name} ${p.description} ${(p.tags || []).join(' ')} ${p.brand} ${p.category}`.toLowerCase();
      // Word-boundary match so "frame" doesn't satisfy a search for "me".
      return qTokens.some((tok) => new RegExp(`\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(hay));
    });
  }
  if (tags.length) {
    products = products.filter((p) => tags.some((t) => p.tags.includes(t)));
  }
  if (typeof minRating === 'number') {
    products = products.filter((p) => p.rating >= minRating);
  }
  if (color) {
    products = products.filter((p) => String(p.color).toLowerCase() === String(color).toLowerCase());
  }
  if (inStock) {
    products = products.filter((p) => p.inStock !== false && p.stock > 0);
  }

  // Sorting
  const sorters = {
    'price-asc':  (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'rating':     (a, b) => b.rating - a.rating,
    'newest':     (a, b) => b.productId.localeCompare(a.productId),
    'relevance':  (a, b) => {
      if (!qTokens.length) return b.rating - a.rating;
      const score = (p) => {
        let s = 0;
        for (const tok of qTokens) {
          if (p.name.toLowerCase().includes(tok)) s += 3;
          if (p.tags.includes(tok)) s += 2;
          if (p.brand.toLowerCase().includes(tok)) s += 1;
        }
        return s + p.rating * 0.5;
      };
      return score(b) - score(a);
    },
  };
  products.sort(sorters[sort] || sorters.relevance);

  const total = products.length;
  const start = (Math.max(1, page) - 1) * pageSize;
  const items = products.slice(start, start + pageSize);

  const out = {
    items,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
    facets: buildFacets(products),
  };
  await cacheSet(cacheKey, out);
  return out;
}

function buildFacets(products) {
  const brands = {};
  const cats = {};
  const colors = {};
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  for (const p of products) {
    brands[p.brand] = (brands[p.brand] || 0) + 1;
    cats[p.category] = (cats[p.category] || 0) + 1;
    colors[p.color] = (colors[p.color] || 0) + 1;
    if (p.price < minPrice) minPrice = p.price;
    if (p.price > maxPrice) maxPrice = p.price;
  }
  return {
    brands,
    categories: cats,
    colors,
    priceRange: minPrice === Infinity ? null : { min: minPrice, max: maxPrice },
  };
}

// ────────────────────────────────────────────────────────────────────
// Detail
// ────────────────────────────────────────────────────────────────────
async function getProduct(productId) {
  const p = await productService.getProductById(productId);
  if (!p) return null;
  // Live stock from hash (kept current as fake-stock-changes fire).
  const liveStock = await client.hget(keys.stockIndex, p.productId);
  if (liveStock !== null) {
    p.stock = parseInt(liveStock, 10);
    p.inStock = p.stock > 0;
  }
  return p;
}

// ────────────────────────────────────────────────────────────────────
// Similar — used by agent tool find_similar + /api/products/:id/similar
// ────────────────────────────────────────────────────────────────────
async function similar(productId, limit = 8) {
  const target = await getProduct(productId);
  if (!target) return [];

  const cohort = await client.smembers(keys.category(target.category));
  const all = await loadProducts(cohort);
  const tagSet = new Set(target.tags);

  const scored = all
    .filter((p) => p.productId !== target.productId)
    .map((p) => {
      const overlap = p.tags.filter((t) => tagSet.has(t)).length;
      const brandBonus = p.brand === target.brand ? 0.5 : 0;
      const priceCloseness = 1 - Math.min(1, Math.abs(p.price - target.price) / Math.max(target.price, 1));
      return {
        ...p,
        _score: overlap * 1.5 + brandBonus + priceCloseness + p.rating * 0.3,
      };
    });

  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, limit);
}

// ────────────────────────────────────────────────────────────────────
// Trending — uses Valkey sorted sets
// ────────────────────────────────────────────────────────────────────
async function trending({ category, limit = 12, window = '1h' } = {}) {
  const key = category ? keys.trendingCategory(category, window) : keys.trendingGlobal(window);
  const withScores = await client.zrevrange(key, 0, limit - 1, 'WITHSCORES');
  const ids = [];
  const scores = {};
  for (let i = 0; i < withScores.length; i += 2) {
    ids.push(withScores[i]);
    scores[withScores[i]] = parseFloat(withScores[i + 1]);
  }
  const products = await loadProducts(ids);
  return products
    .map((p) => ({ ...p, _trendingScore: scores[p.productId] }))
    .sort((a, b) => b._trendingScore - a._trendingScore);
}

async function bumpView(productId, weight = 1) {
  const target = await getProduct(productId);
  if (!target) return;
  await client.zincrby(keys.trendingGlobal('1h'), weight, target.productId);
  await client.zincrby(keys.trendingGlobal('all'), weight * 0.2, target.productId);
  if (target.category) {
    await client.zincrby(keys.trendingCategory(target.category, '1h'), weight, target.productId);
  }
  await client.hincrby(keys.trendingViews, target.productId, 1);
}

// ────────────────────────────────────────────────────────────────────
// Fake stock changes — bonus realism, used by /api/admin/stock/tick
// ────────────────────────────────────────────────────────────────────
async function jiggleStock() {
  const ids = await client.smembers(keys.productIndex);
  const sample = ids.sort(() => Math.random() - 0.5).slice(0, Math.max(3, Math.floor(ids.length * 0.15)));
  const changes = [];
  for (const id of sample) {
    const cur = parseInt((await client.hget(keys.stockIndex, id)) || '0', 10);
    const delta = Math.floor(Math.random() * 7) - 3; // -3 .. +3
    const next = Math.max(0, cur + delta);
    await client.hset(keys.stockIndex, id, next);
    if (next <= 5) await client.sadd(keys.stockLow, id);
    else await client.srem(keys.stockLow, id);
    changes.push({ productId: id, prev: cur, next });
  }
  return changes;
}

module.exports = {
  listCategories,
  queryProducts,
  getProduct,
  similar,
  trending,
  bumpView,
  jiggleStock,
};
