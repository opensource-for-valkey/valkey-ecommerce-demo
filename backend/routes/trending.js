const express = require('express');
const router = express.Router();
const valkey = require('../lib/valkey');

const WINDOWS = { '1h': 3600, '6h': 21600, '24h': 86400 };
const DEFAULT_WINDOW = '24h';
const DEFAULT_LIMIT = 10;

async function trackEvent(productId, categoryId, weight) {
  const pipeline = valkey.pipeline();
  for (const [window, ttl] of Object.entries(WINDOWS)) {
    const globalKey = `trending:global:${window}`;
    pipeline.zincrby(globalKey, weight, productId);
    pipeline.expire(globalKey, ttl);
    if (categoryId) {
      const catKey = `trending:category:${categoryId}:${window}`;
      pipeline.zincrby(catKey, weight, productId);
      pipeline.expire(catKey, ttl);
    }
  }
  await pipeline.exec();
}

async function fetchTrendingProducts(key, limit) {
  const raw = await valkey.zrevrange(key, 0, limit - 1, 'WITHSCORES');
  const products = [];
  for (let i = 0; i < raw.length; i += 2) {
    const productId = raw[i];
    const score = parseFloat(raw[i + 1]);
    try {
      const productRaw = await valkey.call('JSON.GET', productId);
      if (!productRaw) continue;
      let product = JSON.parse(productRaw);
      if (Array.isArray(product)) product = product[0];
      products.push({ ...product, trendingScore: score });
    } catch { /* skip malformed */ }
  }
  return products;
}

/**
 * @swagger
 * tags:
 *   - name: Trending
 *     description: Trending products based on real-time interactions
 *   - name: Events
 *     description: Product interaction event tracking
 */

/**
 * @swagger
 * /api/events/view:
 *   post:
 *     summary: Record a product view event (weight 1)
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f"
 *               categoryId:
 *                 type: string
 *                 example: "category:0192d4e2-1f5a-7c3d-9b2e-8a4f6d0c1e3b"
 *     responses:
 *       204:
 *         description: Event recorded
 *       400:
 *         description: Missing productId
 */
router.post('/events/view', async (req, res) => {
  const { productId, categoryId } = req.body;
  if (!productId) return res.status(400).json({ error: 'missing_product_id', message: 'productId is required' });
  try {
    await trackEvent(productId, categoryId || null, 1);
    res.sendStatus(204);
  } catch (err) {
    console.error('[Trending] view event error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/events/add-to-cart:
 *   post:
 *     summary: Record an add-to-cart event (weight 3)
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Event recorded
 *       400:
 *         description: Missing productId
 */
router.post('/events/add-to-cart', async (req, res) => {
  const { productId, categoryId } = req.body;
  if (!productId) return res.status(400).json({ error: 'missing_product_id', message: 'productId is required' });
  try {
    await trackEvent(productId, categoryId || null, 3);
    res.sendStatus(204);
  } catch (err) {
    console.error('[Trending] add-to-cart event error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/events/purchase:
 *   post:
 *     summary: Record a purchase event (weight 5)
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Event recorded
 *       400:
 *         description: Missing productId
 */
router.post('/events/purchase', async (req, res) => {
  const { productId, categoryId } = req.body;
  if (!productId) return res.status(400).json({ error: 'missing_product_id', message: 'productId is required' });
  try {
    await trackEvent(productId, categoryId || null, 5);
    res.sendStatus(204);
  } catch (err) {
    console.error('[Trending] purchase event error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/trending:
 *   get:
 *     summary: Get global trending products
 *     tags: [Trending]
 *     parameters:
 *       - in: query
 *         name: window
 *         schema:
 *           type: string
 *           enum: [1h, 6h, 24h]
 *           default: 24h
 *         description: Time window for trending calculation
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: Trending products with scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 window:
 *                   type: string
 *                   example: "24h"
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Product'
 *                       - type: object
 *                         properties:
 *                           trendingScore:
 *                             type: number
 */
router.get('/trending', async (req, res) => {
  const window = WINDOWS[req.query.window] ? req.query.window : DEFAULT_WINDOW;
  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 50);
  try {
    const key = `trending:global:${window}`;
    const products = await fetchTrendingProducts(key, limit);
    res.json({ window, limit, total: products.length, products });
  } catch (err) {
    console.error('[Trending] GET /trending error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/trending/{categoryId}:
 *   get:
 *     summary: Get trending products in a specific category
 *     tags: [Trending]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         example: "category:0192d4e2-1f5a-7c3d-9b2e-8a4f6d0c1e3b"
 *       - in: query
 *         name: window
 *         schema:
 *           type: string
 *           enum: [1h, 6h, 24h]
 *           default: 24h
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Category trending products
 */
router.get('/trending/:categoryId', async (req, res) => {
  const categoryId = decodeURIComponent(req.params.categoryId);
  const window = WINDOWS[req.query.window] ? req.query.window : DEFAULT_WINDOW;
  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 50);
  try {
    const key = `trending:category:${categoryId}:${window}`;
    const products = await fetchTrendingProducts(key, limit);
    res.json({ categoryId, window, limit, total: products.length, products });
  } catch (err) {
    console.error('[Trending] GET /trending/:categoryId error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

module.exports = router;
