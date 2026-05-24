/**
 * Build product details route state from agent search results.
 */
export function getAgentProductLink(product) {
  return {
    pathname: '/product-details',
    state: {
      agentProduct: {
        productId: product.productId,
        name: product.name,
        price: product.price,
        rating: product.rating,
        reason: product.reason
      }
    }
  };
}
