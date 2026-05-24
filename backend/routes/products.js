const express = require('express');
const { v7: uuidv7 } = require('uuid');
const valkeyClient = require('../valkeyClient');

const router = express.Router();

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const productId = `product:${uuidv7()}`;
    const timestamp = Date.now();
    
    const product = {
      id: productId,
      createdAt: new Date(timestamp).toISOString(),
      updatedAt: new Date(timestamp).toISOString(),
      status: 'active',
      ...req.body
    };

    // Store in JSON
    await valkeyClient.json.set(productId, '$', product);

    // Update Indexes
    if (product.categoryId) {
      await valkeyClient.zAdd(`category_products:${product.categoryId}`, [{ score: timestamp, value: productId }]);
    }
    if (product.vendorId) {
      await valkeyClient.zAdd(`vendor_products:${product.vendorId}`, [{ score: timestamp, value: productId }]);
    }
    if (product.brand) {
      await valkeyClient.sAdd(`brand_products:${product.brand}`, productId);
    }
    if (product.price && product.price.amount) {
      // Store in paise/cents for precision
      const amount = product.price.amount * 100;
      await valkeyClient.zAdd(`price_index`, [{ score: amount, value: productId }]);
    }
    // Add to a global products list for paginated 'all products'
    await valkeyClient.zAdd(`all_products`, [{ score: timestamp, value: productId }]);

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await valkeyClient.json.get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /api/products/:id
router.patch('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body; 
    
    const exists = await valkeyClient.exists(productId);
    if (!exists) return res.status(404).json({ error: 'Product not found' });

    for (const [path, value] of Object.entries(updates)) {
      await valkeyClient.json.set(productId, path, value);
    }
    
    await valkeyClient.json.set(productId, '$.updatedAt', new Date().toISOString());

    const updatedProduct = await valkeyClient.json.get(productId);
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let productIds = [];

    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice) * 100 : '-inf';
      const max = maxPrice ? parseInt(maxPrice) * 100 : '+inf';
      productIds = await valkeyClient.zRange('price_index', min, max, { BY: 'SCORE' });
    } else if (category) {
      productIds = await valkeyClient.zRange(`category_products:${category}`, '+inf', '-inf', { BY: 'SCORE', REV: true });
    } else if (brand) {
      productIds = await valkeyClient.sMembers(`brand_products:${brand}`);
    } else {
      productIds = await valkeyClient.zRange('all_products', '+inf', '-inf', { BY: 'SCORE', REV: true });
    }

    if (brand && (minPrice || maxPrice || category)) {
      const brandIds = await valkeyClient.sMembers(`brand_products:${brand}`);
      productIds = productIds.filter(id => brandIds.includes(id));
    }
    if (category && (minPrice || maxPrice)) {
      const catIds = await valkeyClient.zRange(`category_products:${category}`, '-inf', '+inf', { BY: 'SCORE' });
      productIds = productIds.filter(id => catIds.includes(id));
    }

    const paginatedIds = productIds.slice(offset, offset + parseInt(limit));
    
    const products = [];
    for (const id of paginatedIds) {
      const p = await valkeyClient.json.get(id);
      if (p) products.push(p);
    }

    res.json({
      products,
      total: productIds.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
