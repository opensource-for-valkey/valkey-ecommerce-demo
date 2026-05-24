const express = require('express');
const router = express.Router();
const valkey = require('../lib/valkey');
const { v7: uuidv7 } = require('uuid');
const { optionalAuth } = require('../middleware/auth');

const FREQ_CAP = 3;

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function getAdDoc(adId) {
  const raw = await valkey.call('JSON.GET', adId);
  if (!raw) return null;
  let doc = JSON.parse(raw);
  if (Array.isArray(doc)) doc = doc[0];
  return doc;
}

/**
 * @swagger
 * tags:
 *   - name: Ads
 *     description: Ad placement, targeting, and performance tracking
 */

/**
 * @swagger
 * /api/seed/ads:
 *   post:
 *     summary: Seed sample ad creatives into Valkey
 *     tags: [Ads]
 *     responses:
 *       200:
 *         description: Ads seeded successfully
 */
router.post('/seed/ads', async (req, res) => {
  try {
    const categoryIds = await valkey.smembers('all_categories');

    // Build a map of category names → ids
    const catMap = {};
    for (const cid of categoryIds) {
      const catRaw = await valkey.call('JSON.GET', cid);
      if (!catRaw) continue;
      let cat = JSON.parse(catRaw);
      if (Array.isArray(cat)) cat = cat[0];
      if (cat?.name && !cat?.parentId) catMap[cat.name.toLowerCase()] = cid;
    }

    const electronicsId = catMap['electronics'] || null;
    const fashionId = catMap['fashion'] || null;
    const homeId = catMap['home & kitchen'] || null;
    const sportsId = catMap['sports & outdoors'] || null;

    const sampleAds = [
      {
        id: `ad:${uuidv7()}`,
        vendorId: 'vendor:seed-001',
        title: 'Mega Electronics Sale — Up to 40% OFF!',
        description: 'Shop the best deals on smartphones, laptops, and gadgets.',
        imageUrl: '/assets/images/thumbs/electronics-ad.jpg',
        targetUrl: '/shop',
        targetCategories: electronicsId ? [electronicsId] : [],
        targetKeywords: ['phone', 'laptop', 'gadget', 'electronics', 'tech'],
        bidAmount: 600,
        dailyBudget: 60000,
        status: 'active',
      },
      {
        id: `ad:${uuidv7()}`,
        vendorId: 'vendor:seed-002',
        title: 'Fashion Forward — New Season Arrivals',
        description: 'Discover the latest trends in clothing and accessories.',
        imageUrl: '/assets/images/thumbs/fashion-ad.jpg',
        targetUrl: '/shop',
        targetCategories: fashionId ? [fashionId] : [],
        targetKeywords: ['fashion', 'clothing', 'apparel', 'style', 'dress'],
        bidAmount: 450,
        dailyBudget: 45000,
        status: 'active',
      },
      {
        id: `ad:${uuidv7()}`,
        vendorId: 'vendor:seed-003',
        title: 'Home Essentials — Transform Your Space',
        description: 'Premium home & kitchen products at unbeatable prices.',
        imageUrl: '/assets/images/thumbs/home-ad.jpg',
        targetUrl: '/shop',
        targetCategories: homeId ? [homeId] : [],
        targetKeywords: ['home', 'kitchen', 'furniture', 'decor', 'appliance'],
        bidAmount: 380,
        dailyBudget: 38000,
        status: 'active',
      },
      {
        id: `ad:${uuidv7()}`,
        vendorId: 'vendor:seed-004',
        title: 'Level Up Your Fitness — Sports Gear Sale',
        description: 'Equipment, apparel, and accessories for every athlete.',
        imageUrl: '/assets/images/thumbs/sports-ad.jpg',
        targetUrl: '/shop',
        targetCategories: sportsId ? [sportsId] : [],
        targetKeywords: ['sports', 'fitness', 'gym', 'outdoor', 'exercise'],
        bidAmount: 320,
        dailyBudget: 32000,
        status: 'active',
      },
      {
        id: `ad:${uuidv7()}`,
        vendorId: 'vendor:seed-001',
        title: 'Valkey Store — Shop Everything',
        description: 'Millions of products. Fast delivery. Best prices guaranteed.',
        imageUrl: '/assets/images/thumbs/global-ad.jpg',
        targetUrl: '/shop',
        targetCategories: [],
        targetKeywords: [],
        bidAmount: 250,
        dailyBudget: 100000,
        status: 'active',
      },
    ];

    const pipeline = valkey.pipeline();
    for (const ad of sampleAds) {
      pipeline.call('JSON.SET', ad.id, '$', JSON.stringify(ad));
      // Index in global sorted set
      pipeline.zadd('ads:global', ad.bidAmount, ad.id);
      // Index per target category
      for (const catId of ad.targetCategories) {
        pipeline.zadd(`ads:category:${catId}`, ad.bidAmount, ad.id);
      }
    }
    await pipeline.exec();

    res.json({ seeded: sampleAds.length, ads: sampleAds.map(a => ({ id: a.id, title: a.title })) });
  } catch (err) {
    console.error('[Ads] seed error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/ads:
 *   get:
 *     summary: Get relevant ads based on context
 *     tags: [Ads]
 *     parameters:
 *       - in: query
 *         name: context
 *         schema:
 *           type: string
 *           enum: [category, keyword, global]
 *           default: global
 *         description: Type of targeting context
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         description: Category ID for context=category, or keyword for context=keyword
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 2
 *     responses:
 *       200:
 *         description: List of relevant ads
 */
router.get('/ads', optionalAuth, async (req, res) => {
  const { context, value } = req.query;
  const limit = Math.min(parseInt(req.query.limit, 10) || 2, 5);
  const userId = req.userId || null;
  const date = today();

  try {
    // Collect candidate ad IDs by bid (highest first)
    let candidateIds = [];

    if (context === 'category' && value) {
      const raw = await valkey.zrevrange(`ads:category:${value}`, 0, 9, 'WITHSCORES');
      for (let i = 0; i < raw.length; i += 2) candidateIds.push(raw[i]);
    }

    // Fill remaining slots from global pool
    const globalRaw = await valkey.zrevrange('ads:global', 0, 9, 'WITHSCORES');
    for (let i = 0; i < globalRaw.length; i += 2) {
      if (!candidateIds.includes(globalRaw[i])) candidateIds.push(globalRaw[i]);
    }

    const ads = [];
    for (const adId of candidateIds) {
      if (ads.length >= limit) break;

      const ad = await getAdDoc(adId);
      if (!ad || ad.status !== 'active') continue;

      // Check daily budget exhausted
      const spend = parseInt(await valkey.get(`ad_spend:${adId}:${date}`) || '0', 10);
      if (spend >= ad.dailyBudget) continue;

      // Frequency cap: skip if user has seen this ad FREQ_CAP times today
      if (userId) {
        const freq = parseInt(await valkey.get(`ad_freq:${userId}:${adId}:${date}`) || '0', 10);
        if (freq >= FREQ_CAP) continue;
      }

      ads.push(ad);
    }

    res.json({ ads, context: context || 'global', value: value || null });
  } catch (err) {
    console.error('[Ads] GET /ads error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/ads:
 *   post:
 *     summary: Create a new ad creative
 *     tags: [Ads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, targetUrl, bidAmount, dailyBudget]
 *             properties:
 *               vendorId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               targetUrl:
 *                 type: string
 *               targetCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *               targetKeywords:
 *                 type: array
 *                 items:
 *                   type: string
 *               bidAmount:
 *                 type: integer
 *               dailyBudget:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Ad created
 */
router.post('/ads', optionalAuth, async (req, res) => {
  const {
    vendorId, title, description, imageUrl, targetUrl,
    targetCategories = [], targetKeywords = [],
    bidAmount, dailyBudget,
  } = req.body;

  if (!title || !targetUrl || !bidAmount || !dailyBudget) {
    return res.status(400).json({ error: 'validation_error', message: 'title, targetUrl, bidAmount, and dailyBudget are required' });
  }

  const ad = {
    id: `ad:${uuidv7()}`,
    vendorId: vendorId || req.userId || null,
    title,
    description: description || '',
    imageUrl: imageUrl || null,
    targetUrl,
    targetCategories,
    targetKeywords,
    bidAmount: parseInt(bidAmount, 10),
    dailyBudget: parseInt(dailyBudget, 10),
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  try {
    const pipeline = valkey.pipeline();
    pipeline.call('JSON.SET', ad.id, '$', JSON.stringify(ad));
    pipeline.zadd('ads:global', ad.bidAmount, ad.id);
    for (const catId of targetCategories) {
      pipeline.zadd(`ads:category:${catId}`, ad.bidAmount, ad.id);
    }
    await pipeline.exec();

    res.status(201).json(ad);
  } catch (err) {
    console.error('[Ads] POST /ads error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/ads/{adId}/impression:
 *   post:
 *     summary: Record an ad impression and increment daily spend
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Impression recorded
 *       404:
 *         description: Ad not found
 */
router.post('/ads/:adId/impression', optionalAuth, async (req, res) => {
  const adId = decodeURIComponent(req.params.adId);
  const userId = req.userId || null;
  const date = today();

  try {
    const ad = await getAdDoc(adId);
    if (!ad) return res.status(404).json({ error: 'not_found', message: 'Ad not found' });

    const pipeline = valkey.pipeline();
    pipeline.incr(`ad_impressions:${adId}:${date}`);
    pipeline.expire(`ad_impressions:${adId}:${date}`, 86400);
    pipeline.incrby(`ad_spend:${adId}:${date}`, ad.bidAmount || 0);
    pipeline.expire(`ad_spend:${adId}:${date}`, 86400);

    if (userId) {
      pipeline.incr(`ad_freq:${userId}:${adId}:${date}`);
      pipeline.expire(`ad_freq:${userId}:${adId}:${date}`, 86400);
    }

    await pipeline.exec();
    res.sendStatus(204);
  } catch (err) {
    console.error('[Ads] impression error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/ads/{adId}/click:
 *   post:
 *     summary: Record an ad click
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Click recorded
 *       404:
 *         description: Ad not found
 */
router.post('/ads/:adId/click', async (req, res) => {
  const adId = decodeURIComponent(req.params.adId);
  const date = today();

  try {
    const ad = await getAdDoc(adId);
    if (!ad) return res.status(404).json({ error: 'not_found', message: 'Ad not found' });

    const pipeline = valkey.pipeline();
    pipeline.incr(`ad_clicks:${adId}:${date}`);
    pipeline.expire(`ad_clicks:${adId}:${date}`, 86400);
    await pipeline.exec();

    res.sendStatus(204);
  } catch (err) {
    console.error('[Ads] click error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @swagger
 * /api/ads/{adId}/stats:
 *   get:
 *     summary: Get ad performance stats for today
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adId:
 *                   type: string
 *                 date:
 *                   type: string
 *                 impressions:
 *                   type: integer
 *                 clicks:
 *                   type: integer
 *                 ctr:
 *                   type: string
 *                 spend:
 *                   type: integer
 *                 budgetRemaining:
 *                   type: integer
 */
router.get('/ads/:adId/stats', async (req, res) => {
  const adId = decodeURIComponent(req.params.adId);
  const date = today();

  try {
    const ad = await getAdDoc(adId);
    if (!ad) return res.status(404).json({ error: 'not_found', message: 'Ad not found' });

    const [impressions, clicks, spend] = await Promise.all([
      valkey.get(`ad_impressions:${adId}:${date}`),
      valkey.get(`ad_clicks:${adId}:${date}`),
      valkey.get(`ad_spend:${adId}:${date}`),
    ]);

    const impressionCount = parseInt(impressions || '0', 10);
    const clickCount = parseInt(clicks || '0', 10);
    const spendAmount = parseInt(spend || '0', 10);

    res.json({
      adId,
      title: ad.title,
      date,
      impressions: impressionCount,
      clicks: clickCount,
      ctr: impressionCount > 0 ? (clickCount / impressionCount).toFixed(4) : '0.0000',
      spend: spendAmount,
      dailyBudget: ad.dailyBudget,
      budgetRemaining: Math.max(0, ad.dailyBudget - spendAmount),
    });
  } catch (err) {
    console.error('[Ads] stats error:', err.message);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

module.exports = router;
