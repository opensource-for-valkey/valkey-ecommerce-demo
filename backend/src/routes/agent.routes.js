const express = require('express');
const { nanoid } = require('nanoid');
const orchestrator = require('../agent/orchestrator');
const conversation = require('../services/conversation.service');
const preference = require('../services/preference.service');
const productService = require('../services/product.service');
const trending = require('../services/trending.service');
const suggestService = require('../services/search-suggest.service');
const { client } = require('../valkey/client');
const keys = require('../valkey/keys');

const router = express.Router();

router.post('/search', async (req, res, next) => {
  try {
    const { sessionId, userId, message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required (string)' });
    }
    const sid = sessionId || `sess_${nanoid(10)}`;
    // Track in Valkey (popular ZSET + per-session LIST). Non-blocking.
    suggestService.track(message, sid).catch(() => {});
    const out = await orchestrator.handleMessage({ sessionId: sid, userId, message });
    res.json(out);
  } catch (e) {
    next(e);
  }
});

// GET /api/agent/suggestions?q=<prefix>&sessionId=<sid>&limit=<n>
router.get('/suggestions', async (req, res, next) => {
  try {
    const q = String(req.query.q || '');
    const sid = req.query.sessionId ? String(req.query.sessionId) : null;
    const limit = Math.min(20, parseInt(req.query.limit || '8', 10));
    const items = await suggestService.suggest(q, sid, limit);
    res.json({ items });
  } catch (e) { next(e); }
});

// GET /api/agent/popular — top-K most searched queries (Valkey ZSET).
router.get('/popular', async (req, res, next) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit || '10', 10));
    const items = await suggestService.getPopular(limit);
    res.json({ items });
  } catch (e) { next(e); }
});

router.get('/conversation/:sessionId', async (req, res, next) => {
  try {
    const convo = await conversation.get(req.params.sessionId);
    if (!convo) return res.status(404).json({ error: 'session not found' });
    res.json(convo);
  } catch (e) {
    next(e);
  }
});

router.delete('/conversation/:sessionId', async (req, res, next) => {
  try {
    await conversation.clear(req.params.sessionId);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post('/feedback', async (req, res, next) => {
  try {
    const { sessionId, userId, productIds = [], sentiment = 'up', note = '' } = req.body || {};
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
    const entry = {
      sessionId,
      userId: userId || null,
      productIds,
      sentiment,
      note,
      ts: new Date().toISOString(),
    };
    await client.rpush(keys.feedback(sessionId), JSON.stringify(entry));
    await client.expire(keys.feedback(sessionId), 60 * 60 * 24 * 30);

    if (userId) {
      await preference.learnFromFeedback(userId, productIds, sentiment, productService.getProductById);
    }
    res.json({ ok: true, entry });
  } catch (e) {
    next(e);
  }
});

router.get('/trending', async (_req, res, next) => {
  try {
    const raw = await trending.topGlobal(10);
    const items = [];
    for (let i = 0; i < raw.length; i += 2) {
      const pid = raw[i];
      const score = parseFloat(raw[i + 1]);
      const p = await productService.getProductById(pid);
      if (p) items.push({ productId: pid, name: p.name, price: p.price, score });
    }
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const p = await productService.getProductById(req.params.id);
    if (!p) return res.status(404).json({ error: 'not found' });
    res.json(p);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
