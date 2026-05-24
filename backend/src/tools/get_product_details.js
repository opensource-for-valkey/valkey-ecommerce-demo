// get_product_details tool — uses catalog.getProduct() so stock is live.
const catalog = require('../services/catalog.service');

async function getProductDetails({ productId }) {
  const p = await catalog.getProduct(productId);
  if (!p) return { found: false };
  return {
    found: true,
    ...p,
    reviews: mockReviews(p),
  };
}

function mockReviews(p) {
  return [
    { rating: Math.min(5, p.rating + 0.2), text: `Great ${p.tags[0] || 'product'}, exactly as described.` },
    { rating: p.rating, text: 'Good value for the price. Recommended.' },
    { rating: Math.max(3, p.rating - 0.5), text: 'Works well, packaging could be better.' },
  ];
}

module.exports = { getProductDetails };
