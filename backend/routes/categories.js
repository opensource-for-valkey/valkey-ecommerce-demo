const express = require('express');
const { v7: uuidv7 } = require('uuid');
const valkeyClient = require('../valkeyClient');

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const keys = await valkeyClient.keys('category:*');
    const categories = [];
    for (const key of keys) {
      const cat = await valkeyClient.json.get(key);
      if (cat) categories.push(cat);
    }
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/categories/:id/products
router.get('/:id/products', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const productIds = await valkeyClient.zRange(`category_products:${categoryId}`, '+inf', '-inf', {
        BY: 'SCORE',
        REV: true,
        LIMIT: { offset, count: limit }
    });

    if (!productIds || productIds.length === 0) {
      return res.json({ products: [], total: 0 });
    }

    const products = [];
    for (const id of productIds) {
      const product = await valkeyClient.json.get(id);
      if (product) products.push(product);
    }

    res.json({ products, total: productIds.length });
  } catch (error) {
    console.error('Category products error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper: POST /api/categories
router.post('/', async (req, res) => {
  try {
    const id = `category:${uuidv7()}`;
    const category = { id, ...req.body };
    await valkeyClient.json.set(id, '$', category);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
