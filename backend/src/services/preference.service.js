const { jsonGet, jsonSet } = require('../valkey/client');
const keys = require('../valkey/keys');
const config = require('../config');

async function get(userId) {
  if (!userId) return null;
  return jsonGet(keys.userPreferences(userId.replace(/^user:/, '')));
}

async function update(userId, partial) {
  if (!userId) return null;
  const k = keys.userPreferences(userId.replace(/^user:/, ''));
  const current = (await jsonGet(k)) || { userId };
  const next = { ...current, ...partial };
  await jsonSet(k, next, config.preferenceTtl);
  return next;
}

// Learn from feedback: bump favoriteCategories on positive, avoidCategories on negative
async function learnFromFeedback(userId, productIds, sentiment, productLookup) {
  if (!userId) return;
  const current = (await get(userId)) || { userId, favoriteCategories: [], avoidCategories: [] };
  const favs = new Set(current.favoriteCategories || []);
  const avoids = new Set(current.avoidCategories || []);
  for (const pid of productIds) {
    const p = await productLookup(pid);
    if (!p) continue;
    if (sentiment === 'up') favs.add(p.category);
    if (sentiment === 'down') avoids.add(p.category);
  }
  return update(userId, {
    favoriteCategories: Array.from(favs).slice(0, 10),
    avoidCategories: Array.from(avoids).slice(0, 10),
  });
}

module.exports = { get, update, learnFromFeedback };
