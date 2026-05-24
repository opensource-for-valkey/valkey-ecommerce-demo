// Seed Valkey with product dataset + indexes.
const { client, jsonSet } = require('../valkey/client');
const keys = require('../valkey/keys');
const products = require('../data/products');
const { categories, brands } = require('../data/categories');
const imageService = require('../services/image.service');

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function flushIndexes() {
  const dels = [
    keys.productIndex,
    keys.embeddingsIndex,
    keys.categoryIndex,
    keys.brandIndex,
    keys.pricesGlobal,
    keys.ratingsGlobal,
    keys.stockIndex,
    keys.stockLow,
    keys.trendingViews,
    keys.trendingGlobal('all'),
    keys.trendingGlobal('1h'),
  ];
  for (const c of categories) {
    dels.push(keys.category(c.slug));
    dels.push(keys.pricesByCategory(c.slug));
    dels.push(keys.ratingsByCategory(c.slug));
    dels.push(keys.trendingCategory(c.slug, 'all'));
    dels.push(keys.trendingCategory(c.slug, '1h'));
  }
  await Promise.all(dels.map((k) => client.del(k)));
}

async function seed() {
  console.log(`[seed] seeding ${products.length} products + ${categories.length} categories...`);
  await flushIndexes();

  // Categories registry
  for (const c of categories) {
    await jsonSet(`category-meta:${c.slug}`, c);
    await client.sadd(keys.categoryIndex, c.slug);
  }

  for (const p of products) {
    const pid = p.productId;
    const idShort = pid.replace('product:', '');
    const brandSlug = slug(p.brand);

    // Resolve real product imagery (Unsplash → Picsum fallback, cached 7d).
    try {
      const img = await imageService.resolve(p);
      if (img && img.main) {
        p.image = img.main;
        p.images = [img.main, ...img.gallery];
      }
    } catch (_) { /* keep template image */ }

    // Main doc
    await jsonSet(keys.product(idShort), p);

    // Global product set
    await client.sadd(keys.productIndex, pid);

    // Category index
    if (p.category) {
      await client.sadd(keys.category(p.category), pid);
      await client.zadd(keys.pricesByCategory(p.category), p.price, pid);
      await client.zadd(keys.ratingsByCategory(p.category), p.rating, pid);
      await client.zadd(keys.trendingCategory(p.category, 'all'), p.rating, pid);
    }

    // Brand index
    if (p.brand) {
      await client.sadd(keys.brand(brandSlug), pid);
      await client.sadd(keys.brandIndex, brandSlug);
    }

    // Price + rating ZSETs (global)
    await client.zadd(keys.pricesGlobal, p.price, pid);
    await client.zadd(keys.ratingsGlobal, p.rating, pid);

    // Stock hash
    await client.hset(keys.stockIndex, pid, p.stock);
    if (p.stock <= 5) await client.sadd(keys.stockLow, pid);

    // Trending — seed with rating + small randomness
    const seedScore = p.rating * 10 + Math.random() * 2;
    await client.zadd(keys.trendingGlobal('all'), seedScore, pid);
    await client.zadd(keys.trendingGlobal('1h'), seedScore, pid);

    // Embedding
    await client.hset(keys.embeddingsIndex, pid, JSON.stringify(p.embedding));
  }

  // Demo user
  await jsonSet(`user_preferences:demo`, {
    userId: 'user:demo',
    pricePreference: 'mid-range',
    favoriteCategories: ['laptop', 'headphone', 'smart-watch'],
    favoriteBrands: ['Apple', 'Sony'],
    avoidCategories: [],
  });

  console.log('[seed] done.');
  await client.quit();
}

if (require.main === module) {
  seed().catch((e) => {
    console.error('[seed] failed:', e);
    process.exit(1);
  });
}

module.exports = { seed };
