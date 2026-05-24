const express = require('express');
const router = express.Router();
const valkey = require('../lib/valkey');

// Weights for scoring (mirrors FT.CREATE WEIGHT values)
const FIELD_WEIGHTS = { name: 5, brand: 3, tags: 2, description: 1 };

const PRICE_RANGES = [
  { label: 'Under ₹1,000',    min: 0,      max: 1000   },
  { label: '₹1,000–₹5,000',   min: 1000,   max: 5000   },
  { label: '₹5,000–₹20,000',  min: 5000,   max: 20000  },
  { label: '₹20,000–₹50,000', min: 20000,  max: 50000  },
  { label: 'Over ₹50,000',    min: 50000,  max: Infinity },
];

// ── tokenizer ──────────────────────────────────────────────────────────────
function tokenize(text) {
  if (!text) return [];
  return [...new Set(
    String(text).toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2)
  )];
}

// ── index one product into Valkey ──────────────────────────────────────────
async function indexProduct(product) {
  const pipeline = valkey.pipeline();

  const fields = [
    { text: product.name,             weight: FIELD_WEIGHTS.name },
    { text: product.brand,            weight: FIELD_WEIGHTS.brand },
    { text: (product.tags || []).join(' '), weight: FIELD_WEIGHTS.tags },
    { text: product.description,      weight: FIELD_WEIGHTS.description },
    { text: product.shortDescription, weight: FIELD_WEIGHTS.description },
  ];

  for (const { text, weight } of fields) {
    for (const word of tokenize(text)) {
      // Inverted index: word → set of productIds
      pipeline.sadd(`search:term:${word}`, product.id);
      // Also index every prefix of each word (enables prefix/fuzzy matching)
      for (let len = 2; len < word.length; len++) {
        pipeline.sadd(`search:prefix:${word.slice(0, len)}`, product.id);
      }
    }
  }

  // Autocomplete: lex-sorted set  "product name\x00productId"
  const acEntry = `${(product.name || '').toLowerCase()}\x00${product.id}`;
  pipeline.zadd('search:autocomplete', 0, acEntry);

  // Also add brand as an autocomplete entry
  if (product.brand) {
    pipeline.zadd('search:autocomplete', 0, `${product.brand.toLowerCase()}\x00${product.id}`);
  }

  await pipeline.exec();
}

// ── fetch & parse a product JSON doc ───────────────────────────────────────
async function getProduct(id) {
  const raw = await valkey.call('JSON.GET', id);
  if (!raw) return null;
  let doc = JSON.parse(raw);
  if (Array.isArray(doc)) doc = doc[0];
  return doc;
}

// ── score a product against a query ────────────────────────────────────────
function scoreProduct(product, queryWords) {
  if (!queryWords.length) return 1;
  let score = 0;
  const check = (text, weight) => {
    if (!text) return;
    const lower = String(text).toLowerCase();
    for (const w of queryWords) {
      if (lower.includes(w)) score += weight;
    }
  };
  check(product.name,             FIELD_WEIGHTS.name);
  check(product.brand,            FIELD_WEIGHTS.brand);
  check((product.tags || []).join(' '), FIELD_WEIGHTS.tags);
  check(product.description,      FIELD_WEIGHTS.description);
  check(product.shortDescription, FIELD_WEIGHTS.description);
  return score;
}

// ── candidate IDs from inverted index ──────────────────────────────────────
async function getCandidates(queryWords) {
  if (!queryWords.length) {
    // Return all product IDs
    return await valkey.zrevrangebyscore('all_products', '+inf', '-inf');
  }

  // For each word try exact, then prefix
  const perWord = await Promise.all(queryWords.map(async (word) => {
    let ids = await valkey.smembers(`search:term:${word}`);
    if (!ids.length) ids = await valkey.smembers(`search:prefix:${word}`);
    return new Set(ids);
  }));

  // AND: intersect all word sets
  let intersection = perWord[0] ? new Set([...perWord[0]]) : new Set();
  for (let i = 1; i < perWord.length; i++) {
    for (const id of intersection) {
      if (!perWord[i].has(id)) intersection.delete(id);
    }
  }

  // If AND gives results, use them; otherwise OR (union)
  if (intersection.size > 0) return [...intersection];

  const union = new Set();
  for (const s of perWord) for (const id of s) union.add(id);
  if (union.size > 0) return [...union];

  // Nothing matched — return full catalog (blank search)
  return await valkey.zrevrangebyscore('all_products', '+inf', '-inf');
}

// ── compute facets from a product list ─────────────────────────────────────
function buildFacets(products, categoryMap) {
  const brands = {};
  const categories = {};
  const priceRangeCounts = PRICE_RANGES.map(r => ({ ...r, count: 0 }));

  for (const p of products) {
    if (p.brand) brands[p.brand] = (brands[p.brand] || 0) + 1;
    if (p.categoryId) {
      const catName = categoryMap[p.categoryId] || p.categoryId;
      if (!categories[p.categoryId]) categories[p.categoryId] = { id: p.categoryId, name: catName, count: 0 };
      categories[p.categoryId].count++;
    }
    const price = p.price?.amount || 0;
    for (const range of priceRangeCounts) {
      if (price >= range.min && price < range.max) { range.count++; break; }
    }
  }

  return {
    brands: Object.entries(brands).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    categories: Object.values(categories).sort((a, b) => b.count - a.count),
    priceRanges: priceRangeCounts.filter(r => r.count > 0).map(({ label, min, max, count }) => ({ label, min, max, count })),
  };
}

// ── build category name map ─────────────────────────────────────────────────
async function getCategoryMap() {
  const ids = await valkey.smembers('all_categories');
  const map = {};
  await Promise.all(ids.map(async (id) => {
    const doc = await getProduct(id);  // categories use same JSON.GET pattern
    if (doc?.name) map[id] = doc.name;
  }));
  return map;
}

// ────────────────────────────────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Full-text product search, autocomplete, and facets
 */

/**
 * @swagger
 * /api/seed/search-index:
 *   post:
 *     summary: Build search indexes from all existing products
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: Index built successfully
 */
router.post('/seed/search-index', async (req, res) => {
  try {
    // Clear old index
    const oldKeys = await valkey.keys('search:term:*');
    const prefixKeys = await valkey.keys('search:prefix:*');
    const toDel = [...oldKeys, ...prefixKeys, 'search:autocomplete'];
    if (toDel.length) await valkey.del(...toDel);

    const productIds = await valkey.zrevrangebyscore('all_products', '+inf', '-inf');
    let indexed = 0;

    for (const id of productIds) {
      const product = await getProduct(id);
      if (!product) continue;
      await indexProduct(product);
      indexed++;
    }

    res.json({ indexed, message: `Search index built for ${indexed} products` });
  } catch (err) {
    console.error('[Search] seed error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Full-text product search with filters, sorting, pagination, and facets
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category ID
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *         description: Filter by brand name
 *       - in: query
 *         name: minPrice
 *         schema: { type: integer }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: integer }
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [relevance, price_asc, price_desc, rating, newest]
 *           default: relevance
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: Search results with facets
 */
router.get('/search', async (req, res) => {
  const { q = '', category, brand, sort = 'relevance', page = 1, pageSize = 12 } = req.query;
  const minPrice = req.query.minPrice ? parseInt(req.query.minPrice, 10) : null;
  const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice, 10) : null;
  const pageNum = Math.max(1, parseInt(page, 10));
  const size    = Math.min(50, Math.max(1, parseInt(pageSize, 10)));

  try {
    const queryWords = tokenize(q);
    const candidateIds = await getCandidates(queryWords);

    // Fetch all candidate docs in parallel
    const docs = (await Promise.all(candidateIds.map(getProduct))).filter(Boolean);

    // In-memory filters
    let filtered = docs.filter(p => {
      if (p.status && p.status !== 'active') return false;
      if (category && p.categoryId !== category) return false;
      if (brand && (p.brand || '').toLowerCase() !== brand.toLowerCase()) return false;
      if (minPrice !== null && (p.price?.amount || 0) < minPrice) return false;
      if (maxPrice !== null && (p.price?.amount || 0) > maxPrice) return false;
      return true;
    });

    // Score each product
    const scored = filtered.map(p => ({ ...p, _score: scoreProduct(p, queryWords) }));

    // Sort
    switch (sort) {
      case 'price_asc':  scored.sort((a, b) => (a.price?.amount||0) - (b.price?.amount||0)); break;
      case 'price_desc': scored.sort((a, b) => (b.price?.amount||0) - (a.price?.amount||0)); break;
      case 'rating':     scored.sort((a, b) => (b.ratings?.average||0) - (a.ratings?.average||0)); break;
      case 'newest':     scored.sort((a, b) => (b.id > a.id ? 1 : -1)); break;
      default:           scored.sort((a, b) => b._score - a._score); break;
    }

    // Facets computed before pagination
    const categoryMap = await getCategoryMap();
    const facets = buildFacets(filtered, categoryMap);

    // Paginate
    const total = scored.length;
    const results = scored.slice((pageNum - 1) * size, pageNum * size);

    res.json({
      query: q,
      total,
      page: pageNum,
      pageSize: size,
      totalPages: Math.ceil(total / size),
      results,
      facets,
    });
  } catch (err) {
    console.error('[Search] GET /search error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/search/suggest:
 *   get:
 *     summary: Autocomplete suggestions (prefix-based, ZRANGEBYLEX)
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: max
 *         schema: { type: integer, default: 8 }
 *     responses:
 *       200:
 *         description: List of suggestions
 */
router.get('/search/suggest', async (req, res) => {
  const { q = '', max = 8 } = req.query;
  const prefix = q.toLowerCase().trim();
  if (!prefix) return res.json({ suggestions: [] });

  try {
    // ZRANGEBYLEX uses "[" prefix and "\xff" upper bound for lexicographic range
    const raw = await valkey.zrangebylex(
      'search:autocomplete',
      `[${prefix}`,
      `[${prefix}\xff`,
      'LIMIT', 0, parseInt(max, 10)
    );

    const seen = new Set();
    const suggestions = [];
    for (const entry of raw) {
      const [name] = entry.split('\x00');
      if (!seen.has(name)) {
        seen.add(name);
        suggestions.push(name);
      }
    }

    res.json({ suggestions });
  } catch (err) {
    console.error('[Search] suggest error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/search/facets:
 *   get:
 *     summary: Get facet counts for a query (brands, categories, price ranges)
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Facet aggregations
 */
router.get('/search/facets', async (req, res) => {
  const { q = '' } = req.query;
  try {
    const queryWords = tokenize(q);
    const candidateIds = await getCandidates(queryWords);
    const docs = (await Promise.all(candidateIds.map(getProduct))).filter(Boolean);
    const active = docs.filter(p => !p.status || p.status === 'active');
    const categoryMap = await getCategoryMap();
    res.json({ query: q, total: active.length, facets: buildFacets(active, categoryMap) });
  } catch (err) {
    console.error('[Search] facets error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

module.exports = router;
