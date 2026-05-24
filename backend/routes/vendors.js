const express = require('express');
const { v7: uuidv7 } = require('uuid');
const valkeyClient = require('../valkeyClient');

const router = express.Router();

// GET /api/vendors
router.get('/', async (req, res) => {
  try {
    const vendorKeys = await valkeyClient.sendCommand(['KEYS', 'vendor:*']);
    if (!vendorKeys || vendorKeys.length === 0) return res.json([]);
    
    const vendors = [];
    for (const key of vendorKeys) {
      if (!key.includes(':products')) { // Filter out zset keys just in case
        const v = await valkeyClient.sendCommand(['JSON.GET', key]);
        if (v) vendors.push(JSON.parse(v));
      }
    }
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// GET /api/vendors/:id/products
router.get('/:id/products', async (req, res) => {
  try {
    const vendorId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const productIds = await valkeyClient.zRange(`vendor_products:${vendorId}`, '+inf', '-inf', {
        BY: 'SCORE',
        REV: true,
        LIMIT: { offset, count: limit }
    });

    if (!productIds || productIds.length === 0) {
      return res.json({ products: [] });
    }

    const products = [];
    for (const id of productIds) {
      const product = await valkeyClient.json.get(id);
      if (product) products.push(product);
    }

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper: POST /api/vendors
router.post('/', async (req, res) => {
  try {
    const id = `vendor:${uuidv7()}`;
    const vendor = { id, joinedAt: new Date().toISOString(), ...req.body };
    await valkeyClient.json.set(id, '$', vendor);
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
