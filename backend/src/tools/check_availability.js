// check_availability tool — uses live stock hash via catalog.getProduct().
const catalog = require('../services/catalog.service');

async function checkAvailability({ productId, postalCode }) {
  const p = await catalog.getProduct(productId);
  if (!p) return { available: false, reason: 'not_found' };
  const deliverable = !postalCode || postalCode !== '99999';
  return {
    available: !!p.inStock && deliverable,
    inStock: !!p.inStock,
    stock: p.stock,
    deliverable,
    eta: deliverable ? '2-4 days' : null,
    postalCode: postalCode || null,
  };
}

module.exports = { checkAvailability };
