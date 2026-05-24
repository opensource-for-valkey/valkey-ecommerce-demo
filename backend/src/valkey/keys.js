module.exports = {
  // Product documents
  product: (id) => `product:${id}`,
  productIndex: 'index:products',

  // Category sets — SADD category:<slug> product:<id>
  category: (slug) => `category:${slug}`,
  categoryIndex: 'index:categories',

  // Brand sets — SADD brand:<slug> product:<id>
  brand: (slug) => `brand:${slug}`,
  brandIndex: 'index:brands',

  // Sorted sets for fast price / rating range queries
  pricesGlobal: 'products:price',
  pricesByCategory: (slug) => `products:price:${slug}`,
  ratingsGlobal: 'products:rating',
  ratingsByCategory: (slug) => `products:rating:${slug}`,

  // Stock (HSET productId -> stock); also stockLow set for low-stock
  stockIndex: 'index:stock',
  stockLow: 'index:stock:low',

  // Conversation + cache + preferences
  conversation: (sessionId) => `conversation:${sessionId}`,
  agentCache: (hash) => `agent_cache:${hash}`,
  apiCache: (hash) => `api_cache:${hash}`,
  userPreferences: (userId) => `user_preferences:${userId}`,

  // Trending
  trendingGlobal: (window = '1h') => `trending:global:${window}`,
  trendingCategory: (cat, window = '1h') => `trending:category:${cat}:${window}`,
  trendingViews: 'trending:views',

  // Feedback + embeddings
  feedback: (sessionId) => `feedback:${sessionId}`,
  embedding: (id) => `embedding:${id}`,
  embeddingsIndex: 'index:embeddings',
};
