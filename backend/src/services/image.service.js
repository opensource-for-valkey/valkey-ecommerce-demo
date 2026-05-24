// Image resolution + caching service.
//
// Resolution order:
//   1. Valkey cache (`image_cache:<productId>`, 7-day TTL).
//   2. Curated `direct` URL from product-images.js if present.
//   3. source.unsplash.com keyword lookup → follow 302 → cache the *resolved*
//      images.unsplash.com/photo-<hash> URL so subsequent loads skip the redirect.
//   4. picsum.photos seeded fallback so nothing is ever blank.

const { client } = require('../valkey/client');
const PRODUCT_IMAGES = require('../data/product-images');

const CACHE_TTL_S = 60 * 60 * 24 * 7; // 7 days
// Unsplash deprecated source.unsplash.com (now 503s). LoremFlickr searches
// Flickr by tag and returns a real, on-topic photo for keywords. We follow
// the 302 once and cache the resolved CDN URL so subsequent loads skip the
// redirect entirely.
const FLICKR_BASE = 'https://loremflickr.com';
const FETCH_TIMEOUT_MS = 9000;

function cacheKey(productId) {
  return `image_cache:${productId}`;
}

async function getCached(productId) {
  try {
    const raw = await client.get(cacheKey(productId));
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

async function setCached(productId, payload) {
  try {
    await client.set(cacheKey(productId), JSON.stringify(payload), 'EX', CACHE_TTL_S);
  } catch (_) { /* non-fatal */ }
}

async function invalidate(productId) {
  try { await client.del(cacheKey(productId)); } catch (_) {}
}

function normalizeUnsplash(url) {
  // Strip ixid/ixlib tracking, force webp + width on Unsplash URLs only.
  try {
    const u = new URL(url);
    if (!/(^|\.)unsplash\.com$/.test(u.hostname)) return url;
    u.searchParams.delete('ixid');
    u.searchParams.delete('ixlib');
    u.searchParams.delete('auto');
    u.searchParams.set('w', '800');
    u.searchParams.set('q', '80');
    u.searchParams.set('fm', 'webp');
    return u.toString();
  } catch (_) {
    return url;
  }
}

async function resolveFlickrOnce(query, size) {
  const url = `${FLICKR_BASE}/${size}/${size}/${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    // Let fetch follow the redirect — res.url ends at the resolved CDN URL.
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    if (res.ok && res.url && res.url !== url && res.url.includes('loremflickr.com')) {
      return res.url;
    }
  } catch (_) { /* timeout / offline */ }
  finally { clearTimeout(timer); }
  return null;
}

async function resolveFlickr(query, size = 800) {
  // Retry once — loremflickr occasionally times out under back-to-back load.
  return (await resolveFlickrOnce(query, size)) || (await resolveFlickrOnce(query, size));
}

function picsumSeeded(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/800`;
}

function buildQueries(product) {
  const curated = PRODUCT_IMAGES[product.productId];
  if (curated && Array.isArray(curated.queries) && curated.queries.length) {
    return curated.queries;
  }
  // Build from product name / brand / category as a last-resort.
  const name = String(product.name || '').toLowerCase();
  const brand = String(product.brand || '').toLowerCase();
  const cat = String(product.category || '').toLowerCase().replace(/-/g, ' ');
  return [`${brand} ${name}`.trim(), name, cat].filter(Boolean);
}

async function resolve(product, { force = false } = {}) {
  if (!product || !product.productId) return null;
  if (!force) {
    const cached = await getCached(product.productId);
    if (cached) return cached;
  }

  const curated = PRODUCT_IMAGES[product.productId] || {};

  // 1. Hand-picked direct URL wins outright.
  if (curated.direct) {
    const payload = {
      main: normalizeUnsplash(curated.direct),
      gallery: (curated.gallery || []).map(normalizeUnsplash),
      source: 'curated',
    };
    await setCached(product.productId, payload);
    return payload;
  }

  // 2. Resolve via loremflickr keyword → direct CDN URL.
  const queries = buildQueries(product);
  let main = null;
  const gallery = [];
  for (const q of queries) {
    const direct = await resolveFlickr(q);
    if (!direct) continue;
    if (!main) main = direct;
    else if (!gallery.includes(direct) && gallery.length < 2) gallery.push(direct);
    if (main && gallery.length >= 2) break;
  }

  if (main) {
    while (gallery.length < 2) {
      gallery.push(picsumSeeded(`${product.productId}-${gallery.length + 2}`));
    }
    const payload = { main, gallery, source: 'loremflickr' };
    await setCached(product.productId, payload);
    return payload;
  }

  // 3. Picsum fallback — deterministic per product.
  const payload = {
    main: picsumSeeded(product.productId),
    gallery: [
      picsumSeeded(`${product.productId}-2`),
      picsumSeeded(`${product.productId}-3`),
    ],
    source: 'picsum',
  };
  await setCached(product.productId, payload);
  return payload;
}

module.exports = { resolve, invalidate };
