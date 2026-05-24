const { client } = require('../config/db');

const productController = {
  // Get all products with optional filtering/sorting
  getProducts: async (req, res) => {
    try {
      const { category, sort, limit = 20 } = req.query;
      
      let productIds = [];
      if (category) {
        productIds = await client.sMembers(`category:${category}:products`);
      } else {
        // If no category, just get latest products from index
        const results = await client.zRange('product_index', 0, -1, { REV: true });
        productIds = results;
      }

      let products = [];
      for (const id of productIds) {
        const product = await client.json.get(`product:${id}`);
        if (product) products.push(product);
      }

      // Basic sorting
      if (sort === 'popular') {
        products.sort((a, b) => b.sold - a.sold);
      } else if (sort === 'price_asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        products.sort((a, b) => b.price - a.price);
      } else {
        // Default: newest first
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // Apply limit
      products = products.slice(0, parseInt(limit));

      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  // Get a single product
  getProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await client.json.get(`product:${id}`);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  // Get trending products
  getTrending: async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const trendingIds = await client.zRange('products_by_views', 0, parseInt(limit) - 1, { REV: true });
      
      const products = [];
      for (const id of trendingIds) {
        const product = await client.json.get(`product:${id}`);
        if (product) products.push(product);
      }
      
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching trending products:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  // Get flash sales / deals
  getDeals: async (req, res) => {
    try {
      const dealIds = await client.sMembers('deals_products');
      const products = [];
      for (const id of dealIds) {
        const product = await client.json.get(`product:${id}`);
        if (product) products.push(product);
      }
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching deals:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getBestSellers: async (req, res) => {
    try {
      const ids = await client.zRange('products_by_sales', 0, 9, { REV: true });
      const products = [];
      for (const id of ids) {
        const product = await client.json.get(`product:${id}`);
        if (product) products.push(product);
      }
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getProductReviews: async (req, res) => {
    try {
      const { id } = req.params;
      const reviews = await client.json.get(`reviews:${id}`);
      res.status(200).json(reviews || []);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = productController;
