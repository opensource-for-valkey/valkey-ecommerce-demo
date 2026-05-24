// Search suggestions + popular/recent query tracking, all backed by Valkey.
//
// Keys:
//   search:popular         (ZSET) — ZINCRBY <score=1> <query>; top-K popular queries.
//   search:recent:<sid>    (LIST) — LPUSH query, LTRIM 0 9, EXPIRE 30d; last 10 queries per session.
//   search:terms           (SET)  — every product name token + category + tag, lowercased.
//                                   Built lazily on first suggestion request, cached for 1h.

const { client } = require('../valkey/client');
const productService = require('./product.service');

const POPULAR_KEY = 'search:popular';
const TERMS_KEY = 'search:terms';
const TERMS_TTL_S = 60 * 60; // 1h
const RECENT_TTL_S = 60 * 60 * 24 * 30; // 30d
const RECENT_LIMIT = 10;

function normalize(q) {
  return String(q || '').trim().toLowerCase().slice(0, 80);
}

function recentKey(sid) {
  return `search:recent:${sid}`;
}

async function track(query, sessionId) {
  const q = normalize(query);
  if (!q || q.length < 2) return;
  try {
    await client.zincrby(POPULAR_KEY, 1, q);
    if (sessionId) {
      const key = recentKey(sessionId);
      // De-dupe within recent: remove any prior identical entry, push to head.
      await client.lrem(key, 0, q);
      await client.lpush(key, q);
      await client.ltrim(key, 0, RECENT_LIMIT - 1);
      await client.expire(key, RECENT_TTL_S);
    }
  } catch (_) { /* non-fatal */ }
}

async function getPopular(limit = 6) {
  try {
    const raw = await client.zrevrange(POPULAR_KEY, 0, limit - 1);
    return raw || [];
  } catch (_) { return []; }
}

async function getRecent(sessionId, limit = 6) {
  if (!sessionId) return [];
  try {
    return (await client.lrange(recentKey(sessionId), 0, limit - 1)) || [];
  } catch (_) { return []; }
}

async function ensureTerms() {
  try {
    const ttl = await client.ttl(TERMS_KEY);
    if (ttl > 60) return; // still fresh
  } catch (_) { /* fall through */ }
  try {
    const products = await productService.getAllProducts();
    if (!products.length) return;
    const set = new Set();
    for (const p of products) {
      // Whole product name
      if (p.name) set.add(String(p.name).toLowerCase());
      // Per-word
      for (const w of String(p.name || '').toLowerCase().split(/[^a-z0-9]+/)) {
        if (w.length >= 3) set.add(w);
      }
      // Category label & slug
      if (p.category) {
        set.add(String(p.category).replace(/-/g, ' '));
        set.add(String(p.category));
      }
      // Brand
      if (p.brand) set.add(String(p.brand).toLowerCase());
      // Tags
      for (const t of p.tags || []) if (t) set.add(String(t).toLowerCase());
    }
    if (set.size === 0) return;
    await client.del(TERMS_KEY);
    await client.sadd(TERMS_KEY, ...set);
    await client.expire(TERMS_KEY, TERMS_TTL_S);
  } catch (_) { /* non-fatal */ }
}

async function suggest(prefix, sessionId, limit = 8) {
  const q = normalize(prefix);
  await ensureTerms();
  const out = [];
  const seen = new Set();

  const push = (label, kind) => {
    if (!label) return;
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ label, kind });
  };

  if (!q) {
    // Empty input — surface recent + popular as starter chips.
    const recent = await getRecent(sessionId, 4);
    for (const r of recent) push(r, 'recent');
    const popular = await getPopular(8);
    for (const p of popular) push(p, 'popular');
    return out.slice(0, limit);
  }

  // 1. Prefix matches from cached terms.
  try {
    const terms = await client.smembers(TERMS_KEY);
    const prefixHits = [];
    const containsHits = [];
    for (const t of terms) {
      if (t.startsWith(q)) prefixHits.push(t);
      else if (t.includes(q)) containsHits.push(t);
    }
    prefixHits.sort((a, b) => a.length - b.length);
    containsHits.sort((a, b) => a.length - b.length);
    for (const t of prefixHits.slice(0, limit)) push(t, 'product');
    for (const t of containsHits.slice(0, limit - out.length)) push(t, 'product');
  } catch (_) { /* fall through */ }

  // 2. Sprinkle popular queries that share the prefix.
  if (out.length < limit) {
    const popular = await getPopular(20);
    for (const p of popular) {
      if (p.includes(q)) push(p, 'popular');
      if (out.length >= limit) break;
    }
  }

  return out.slice(0, limit);
}

module.exports = { track, suggest, getPopular, getRecent };
