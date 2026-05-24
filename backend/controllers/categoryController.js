const { client } = require('../config/db');

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categoriesHash = await client.hGetAll('categories');
      
      const categories = [];
      for (const [slug, name] of Object.entries(categoriesHash)) {
        // We could also store icons and other metadata in a JSON object for each category
        const catData = await client.json.get(`category:${slug}`);
        if (catData) {
            categories.push(catData);
        } else {
            categories.push({ slug, name });
        }
      }
      
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = categoryController;
