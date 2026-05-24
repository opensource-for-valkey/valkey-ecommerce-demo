// find_similar tool — delegates to catalog.similar() so /api/products/:id/similar
// and the agent return the same set.
const catalog = require('../services/catalog.service');

async function findSimilar({ productId, limit = 5 }) {
  return catalog.similar(productId, limit);
}

module.exports = { findSimilar };
