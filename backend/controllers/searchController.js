const { client } = require('../config/db');

const searchController = {
  search: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(200).json([]);
      }
      
      // Very basic keyword matching against all products
      const allProductIds = await client.zRange('product_index', 0, -1);
      const results = [];
      const queryLower = q.toLowerCase();
      
      for (const pId of allProductIds) {
        const product = await client.json.get(`product:${pId}`);
        if (product && (
            product.name.toLowerCase().includes(queryLower) || 
            product.description.toLowerCase().includes(queryLower) ||
            product.category.toLowerCase().includes(queryLower)
        )) {
          results.push(product);
        }
      }
      
      res.status(200).json(results);
    } catch (error) {
      console.error('Error in search:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getSuggestions: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(200).json([]);
      }
      
      const namesHash = await client.hGetAll('product_names');
      const queryLower = q.toLowerCase();
      const suggestions = [];
      
      for (const [name, id] of Object.entries(namesHash)) {
        if (name.toLowerCase().includes(queryLower)) {
          suggestions.push({ name, id });
          if (suggestions.length >= 5) break; // Limit to 5 suggestions
        }
      }
      
      res.status(200).json(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = searchController;
