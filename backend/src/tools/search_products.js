// search_products tool — delegates to /api/products query layer so backend
// and agent share the same catalog logic.
const catalog = require('../services/catalog.service');

async function searchProducts(params = {}) {
  const {
    query = '',
    categories = [],
    tags = [],
    minPrice,
    maxPrice,
    minRating,
    ageGroup, // legacy from older agent prompts; ignored for electronics catalog
    brand,
    sort = 'relevance',
    limit = 8,
  } = params;

  // Frontend uses a single canonical category slug per product; if agent passes
  // multiple categories we union the results.
  const collected = [];
  const cats = categories.length ? categories : [undefined];
  for (const cat of cats) {
    const out = await catalog.queryProducts({
      q: query,
      category: cat,
      brand,
      minPrice,
      maxPrice,
      minRating,
      tags,
      inStock: true,
      sort,
      page: 1,
      pageSize: limit,
    });
    for (const item of out.items) collected.push({ ...item, _score: item._score || item.rating });
  }

  // De-dupe + cap
  const byId = new Map();
  for (const p of collected) if (!byId.has(p.productId)) byId.set(p.productId, p);
  return Array.from(byId.values()).slice(0, limit);
}

module.exports = { searchProducts };
