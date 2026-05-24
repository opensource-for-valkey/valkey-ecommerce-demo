const { client } = require('../valkey/client');
const keys = require('../valkey/keys');

async function bump(productId, weight = 1) {
  await client.zincrby(keys.trendingGlobal('1h'), weight, productId);
}

async function topGlobal(limit = 10) {
  return client.zrevrange(keys.trendingGlobal('1h'), 0, limit - 1, 'WITHSCORES');
}

async function topByCategory(category, limit = 10) {
  return client.zrevrange(keys.trendingCategory(category, 'all'), 0, limit - 1, 'WITHSCORES');
}

module.exports = { bump, topGlobal, topByCategory };
