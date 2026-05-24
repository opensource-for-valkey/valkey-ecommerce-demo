import api from './api';

export const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  getProductReviews: async (id) => {
    const response = await api.get(`/products/${id}/reviews`);
    return response.data;
  },
  
  getTrending: async (limit = 10) => {
    const response = await api.get('/products/trending', { params: { limit } });
    return response.data;
  },
  
  getDeals: async () => {
    const response = await api.get('/products/deals');
    return response.data;
  },
  
  getBestSellers: async () => {
    const response = await api.get('/products/best-sellers');
    return response.data;
  }
};

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },
  
  updateQuantity: async (productId, quantity) => {
    const response = await api.put('/cart/update', { productId, quantity });
    return response.data;
  },
  
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },
  
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },
  
  addToWishlist: async (productId) => {
    const response = await api.post('/wishlist/add', { productId });
    return response.data;
  },
  
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  }
};
