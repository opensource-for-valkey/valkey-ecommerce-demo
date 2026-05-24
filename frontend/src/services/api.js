const API_BASE_URL = 'http://localhost:3001/api';

// Get all products
export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

// Get trending products
export const getTrending = async () => {
  const response = await fetch(`${API_BASE_URL}/trending`);
  if (!response.ok) {
    throw new Error('Failed to fetch trending products');
  }
  return response.json();
};

// Bump trending score for a product
export const bumpTrending = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/trending/bump/${productId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to bump trending product');
  }
  return response.json();
};

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
  return response.json();
};
