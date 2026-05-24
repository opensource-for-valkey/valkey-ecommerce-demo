const express = require('express');
const catalog = require('../services/catalog.service');
const productService = require('../services/product.service');
const { seed } = require('../scripts/seed');

const router = express.Router();

function parseQuery(req) {
  const q = req.query;
  const num = (v) => (v === undefined || v === '' ? undefined : Number(v));
  const list = (v) =>
    !v ? [] : Array.isArray(v) ? v : String(v).split(',').map((s) => s.trim()).filter(Boolean);
  return {
    q: q.q || q.search || '',
    category: q.category || undefined,
    brand: q.brand || undefined,
    color: q.color || undefined,
    minPrice: num(q.minPrice),
    maxPrice: num(q.maxPrice),
    minRating: num(q.minRating),
    inStock: q.inStock === 'true',
    tags: list(q.tags),
    sort: q.sort || 'relevance',
    page: Math.max(1, parseInt(q.page || '1', 10)),
    pageSize: Math.min(60, Math.max(1, parseInt(q.pageSize || q.limit || '24', 10))),
  };
}

// GET /api/categories
router.get('/categories', async (_req, res, next) => {
  try {
    const items = await catalog.listCategories();
    res.json({ items });
  } catch (e) { next(e); }
});

// GET /api/products  (list / filter / sort / paginate)
router.get('/products', async (req, res, next) => {
  try {
    const out = await catalog.queryProducts(parseQuery(req));
    res.json(out);
  } catch (e) { next(e); }
});

// GET /api/products/trending
router.get('/products/trending', async (req, res, next) => {
  try {
    const items = await catalog.trending({
      category: req.query.category || undefined,
      limit: Math.min(50, parseInt(req.query.limit || '12', 10)),
      window: req.query.window || '1h',
    });
    res.json({ items });
  } catch (e) { next(e); }
});

// GET /api/products/:id
router.get('/products/:id', async (req, res, next) => {
  try {
    const p = await catalog.getProduct(req.params.id);
    if (!p) return res.status(404).json({ error: 'not_found' });
    // fire-and-forget view bump → powers trending
    catalog.bumpView(p.productId).catch(() => {});
    res.json(p);
  } catch (e) { next(e); }
});

// GET /api/products/:id/image
router.get('/products/:id/image', async (req, res, next) => {
  try {
    const p = await catalog.getProduct(req.params.id);
    if (!p) return res.status(404).json({ error: 'not_found' });
    const imageService = require('../services/image.service');
    const img = await imageService.resolve(p);
    res.json(img);
  } catch (e) { next(e); }
});

// GET /api/products/:id/similar
router.get('/products/:id/similar', async (req, res, next) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit || '8', 10));
    const items = await catalog.similar(req.params.id, limit);
    res.json({ items });
  } catch (e) { next(e); }
});

// GET /api/search  (alias to /products with relaxed contract — used by agent tool fallback)
router.get('/search', async (req, res, next) => {
  try {
    const out = await catalog.queryProducts(parseQuery(req));
    res.json(out);
  } catch (e) { next(e); }
});

// POST /api/admin/seed  (idempotent: re-seeds Valkey from src/data/products.js)
router.post('/admin/seed', async (_req, res, next) => {
  try {
    productService.invalidateMemoryCache();
    // seed() closes the client at the end so it can be run as a CLI script. Call
    // the underlying body inline instead by re-importing fresh module would be
    // overkill — we expose this by invoking the internal logic directly.
    const { client, jsonSet } = require('../valkey/client');
    const keys = require('../valkey/keys');
    const products = require('../data/products');
    const { categories } = require('../data/categories');

    const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const dels = [
      keys.productIndex, keys.embeddingsIndex, keys.categoryIndex, keys.brandIndex,
      keys.pricesGlobal, keys.ratingsGlobal, keys.stockIndex, keys.stockLow,
      keys.trendingViews, keys.trendingGlobal('all'), keys.trendingGlobal('1h'),
    ];
    for (const c of categories) {
      dels.push(keys.category(c.slug), keys.pricesByCategory(c.slug), keys.ratingsByCategory(c.slug));
      dels.push(keys.trendingCategory(c.slug, 'all'), keys.trendingCategory(c.slug, '1h'));
    }
    await Promise.all(dels.map((k) => client.del(k)));

    for (const c of categories) {
      await jsonSet(`category-meta:${c.slug}`, c);
      await client.sadd(keys.categoryIndex, c.slug);
    }

    for (const p of products) {
      const pid = p.productId;
      const idShort = pid.replace('product:', '');
      const brandSlug = slug(p.brand);
      await jsonSet(keys.product(idShort), p);
      await client.sadd(keys.productIndex, pid);
      if (p.category) {
        await client.sadd(keys.category(p.category), pid);
        await client.zadd(keys.pricesByCategory(p.category), p.price, pid);
        await client.zadd(keys.ratingsByCategory(p.category), p.rating, pid);
        await client.zadd(keys.trendingCategory(p.category, 'all'), p.rating, pid);
      }
      if (p.brand) {
        await client.sadd(keys.brand(brandSlug), pid);
        await client.sadd(keys.brandIndex, brandSlug);
      }
      await client.zadd(keys.pricesGlobal, p.price, pid);
      await client.zadd(keys.ratingsGlobal, p.rating, pid);
      await client.hset(keys.stockIndex, pid, p.stock);
      if (p.stock <= 5) await client.sadd(keys.stockLow, pid);
      const seedScore = p.rating * 10 + Math.random() * 2;
      await client.zadd(keys.trendingGlobal('all'), seedScore, pid);
      await client.zadd(keys.trendingGlobal('1h'), seedScore, pid);
      await client.hset(keys.embeddingsIndex, pid, JSON.stringify(p.embedding));
    }

    res.json({ ok: true, products: products.length, categories: categories.length });
  } catch (e) { next(e); }
});

// POST /api/admin/stock/tick — bonus: jiggle stock for "live" feel
router.post('/admin/stock/tick', async (_req, res, next) => {
  try {
    const changes = await catalog.jiggleStock();
    res.json({ ok: true, changes });
  } catch (e) { next(e); }
});

module.exports = router;
