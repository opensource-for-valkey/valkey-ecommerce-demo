const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const agentRoutes = require('./routes/agent.routes');
const productRoutes = require('./routes/product.routes');
const { detectJsonModule, client } = require('./valkey/client');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', async (_req, res) => {
  let valkey = 'down';
  let jsonModule = false;
  try {
    const pong = await client.ping();
    if (pong === 'PONG') valkey = 'up';
    jsonModule = await detectJsonModule();
  } catch (_) {}
  res.json({
    status: 'ok',
    valkey,
    jsonModule,
    gemini: !!config.geminiKey,
    time: new Date().toISOString(),
  });
});

app.use('/api/agent', agentRoutes);
app.use('/api', productRoutes);

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: err.message || 'internal_error' });
});

async function autoSeedIfEmpty() {
  try {
    const keys = require('./valkey/keys');
    const products = require('./data/products');
    const expected = products.length;
    const actual = await client.scard(keys.productIndex);
    // Always invalidate tool/result caches on startup so code changes (NLU,
    // semantic_search, etc.) aren't masked by 5-minute cached answers.
    const startupAgentKeys = await client.keys('agent_cache:*');
    if (startupAgentKeys.length) await client.del(...startupAgentKeys);
    const startupApiKeys = await client.keys('api_cache:*');
    if (startupApiKeys.length) await client.del(...startupApiKeys);
    if (actual !== expected) {
      console.log(`[server] product index has ${actual}, expected ${expected} — re-seeding...`);
      const { jsonSet } = require('./valkey/client');
      const { categories } = require('./data/categories');
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
      // Also invalidate API cache so cached "no items" answers don't survive a reseed.
      const cacheKeys = await client.keys('api_cache:*');
      if (cacheKeys.length) await client.del(...cacheKeys);
      const agentKeys = await client.keys('agent_cache:*');
      if (agentKeys.length) await client.del(...agentKeys);

      for (const c of categories) {
        await jsonSet(`category-meta:${c.slug}`, c);
        await client.sadd(keys.categoryIndex, c.slug);
      }
      const imageService = require('./services/image.service');
      for (const p of products) {
        const pid = p.productId;
        const idShort = pid.replace('product:', '');
        const brandSlug = slug(p.brand);
        try {
          const img = await imageService.resolve(p);
          if (img && img.main) {
            p.image = img.main;
            p.images = [img.main, ...img.gallery];
          }
        } catch (_) {}
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
      // Drop in-process memory cache so the next read pulls fresh products.
      require('./services/product.service').invalidateMemoryCache();
      // Wipe any tool/result caches that may have been populated WHILE the seed
      // was still running (concurrent requests can bake partial-data answers).
      const postAgent = await client.keys('agent_cache:*');
      if (postAgent.length) await client.del(...postAgent);
      const postApi = await client.keys('api_cache:*');
      if (postApi.length) await client.del(...postApi);
      console.log(`[server] auto-seed complete: ${products.length} products, ${categories.length} categories`);
    } else {
      console.log(`[server] product index already has ${actual} products — skipping auto-seed`);
    }
  } catch (e) {
    console.warn('[server] auto-seed skipped:', e.message);
  }
}

const server = app.listen(config.port, async () => {
  console.log(`[server] agentic-search listening on http://localhost:${config.port}`);
  console.log(`[server] valkey: ${config.valkeyUrl}`);
  console.log(`[server] gemini enabled: ${!!config.geminiKey}`);
  await autoSeedIfEmpty();
});

const shutdown = async () => {
  console.log('[server] shutting down...');
  server.close();
  try { await client.quit(); } catch (_) {}
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
