const express = require('express');
const router = express.Router();
const { v7: uuidv7 } = require('uuid');
const valkey = require('../lib/valkey');

function buildCategoryTree(categories) {
  const map = {};
  categories.forEach(cat => { map[cat.id] = { ...cat, children: [] }; });
  const roots = [];
  categories.forEach(cat => {
    if (!cat.parentId) {
      roots.push(map[cat.id]);
    } else if (map[cat.parentId]) {
      map[cat.parentId].children.push(map[cat.id]);
    }
  });
  return roots;
}

function flattenToJsonPaths(obj, prefix = '$') {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    const path = `${prefix}.${key}`;
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flattenToJsonPaths(val, path));
    } else {
      result[path] = val;
    }
  }
  return result;
}

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: List products with optional filters and pagination
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category ID (e.g. category:0192d4e2-3a7b-7e1f-8c4d-2b6a9f0e5d7c)
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *         description: Filter by brand name (case-insensitive)
 *       - in: query
 *         name: vendorId
 *         schema: { type: string }
 *         description: Filter by vendor ID
 *       - in: query
 *         name: minPrice
 *         schema: { type: integer }
 *         description: Minimum price (inclusive)
 *       - in: query
 *         name: maxPrice
 *         schema: { type: integer }
 *         description: Maximum price (inclusive)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 total: { type: integer }
 */
router.get('/products', async (req, res) => {
  try {
    const { category, brand, vendorId, minPrice, maxPrice } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    let candidateIds = [];

    if (category) {
      candidateIds = await valkey.zrevrangebyscore(`category_products:${category}`, '+inf', '-inf');
    } else if (minPrice !== undefined || maxPrice !== undefined) {
      const min = minPrice !== undefined ? parseInt(minPrice) : '-inf';
      const max = maxPrice !== undefined ? parseInt(maxPrice) : '+inf';
      candidateIds = await valkey.zrangebyscore('price_index', min, max);
    } else if (brand) {
      candidateIds = await valkey.smembers(`brand_products:${brand.toLowerCase()}`);
    } else if (vendorId) {
      candidateIds = await valkey.smembers(`vendor_products:${vendorId}`);
    } else {
      candidateIds = await valkey.zrevrangebyscore('all_products', '+inf', '-inf');
    }

    if (candidateIds.length === 0) {
      return res.json({ data: [], page, limit, total: 0 });
    }

    const rawList = await Promise.all(candidateIds.map(id => valkey.call('JSON.GET', id)));
    let products = rawList.map(raw => raw ? JSON.parse(raw) : null).filter(Boolean);

    if (brand) {
      products = products.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
    }
    if (vendorId) {
      products = products.filter(p => p.vendorId === vendorId);
    }
    if (minPrice !== undefined) {
      products = products.filter(p => p.price?.amount >= parseInt(minPrice));
    }
    if (maxPrice !== undefined) {
      products = products.filter(p => p.price?.amount <= parseInt(maxPrice));
    }

    if (!category && !(minPrice !== undefined || maxPrice !== undefined)) {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = products.length;
    const data = products.slice(offset, offset + limit);
    return res.json({ data, page, limit, total });
  } catch (err) {
    console.error('[Products] List error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a single product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f
 *     responses:
 *       200:
 *         description: Product document
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/products/:id', async (req, res) => {
  try {
    const raw = await valkey.call('JSON.GET', req.params.id);
    if (!raw) {
      return res.status(404).json({ error: 'not_found', message: 'Product not found' });
    }
    return res.json(JSON.parse(raw));
  } catch (err) {
    console.error('[Products] Get error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, sku, categoryId, vendorId, brand, price]
 *             properties:
 *               name: { type: string }
 *               sku: { type: string }
 *               categoryId: { type: string }
 *               vendorId: { type: string }
 *               brand: { type: string }
 *               price:
 *                 type: object
 *                 properties:
 *                   amount: { type: integer }
 *                   currency: { type: string, default: INR }
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing required fields
 */
router.post('/products', async (req, res) => {
  try {
    const { name, sku, categoryId, vendorId, brand, price } = req.body;
    if (!name || !sku || !categoryId || !vendorId || !brand || price?.amount === undefined) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'name, sku, categoryId, vendorId, brand, and price.amount are required',
      });
    }

    const productId = `product:${uuidv7()}`;
    const now = new Date().toISOString();
    const timestamp = Date.now();

    const product = {
      id: productId,
      sku: sku.trim(),
      name: name.trim(),
      slug: req.body.slug || name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: req.body.description || '',
      shortDescription: req.body.shortDescription || '',
      categoryId,
      vendorId,
      brand: brand.trim(),
      price: {
        amount: price.amount,
        currency: price.currency || 'INR',
        compareAt: price.compareAt || null,
      },
      images: req.body.images || [],
      attributes: req.body.attributes || {},
      tags: req.body.tags || [],
      inventory: req.body.inventory || { quantity: 0, reserved: 0, warehouse: '' },
      ratings: req.body.ratings || { average: 0, count: 0 },
      status: req.body.status || 'active',
      createdAt: now,
      updatedAt: now,
    };

    await valkey.call('JSON.SET', productId, '$', JSON.stringify(product));

    await Promise.all([
      valkey.zadd(`category_products:${categoryId}`, timestamp, productId),
      valkey.sadd(`brand_products:${brand.toLowerCase()}`, productId),
      valkey.zadd('price_index', price.amount, productId),
      valkey.sadd(`vendor_products:${vendorId}`, productId),
      valkey.zadd('all_products', timestamp, productId),
    ]);

    return res.status(201).json(product);
  } catch (err) {
    console.error('[Products] Create error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Partially update a product using JSON.SET on nested paths
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               price:
 *                 amount: 79999
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.patch('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await valkey.call('JSON.GET', id);
    if (!existing) {
      return res.status(404).json({ error: 'not_found', message: 'Product not found' });
    }

    const { id: _id, createdAt: _ca, ...updates } = req.body;
    const paths = flattenToJsonPaths(updates);

    for (const [path, value] of Object.entries(paths)) {
      await valkey.call('JSON.SET', id, path, JSON.stringify(value));
    }

    await valkey.call('JSON.SET', id, '$.updatedAt', JSON.stringify(new Date().toISOString()));

    if (updates.price?.amount !== undefined) {
      await valkey.zrem('price_index', id);
      await valkey.zadd('price_index', updates.price.amount, id);
    }

    const updated = await valkey.call('JSON.GET', id);
    return res.json(JSON.parse(updated));
  } catch (err) {
    console.error('[Products] Update error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: List all categories as a nested tree (2+ levels)
 *     responses:
 *       200:
 *         description: Category tree
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/categories', async (req, res) => {
  try {
    const categoryIds = await valkey.smembers('all_categories');
    if (categoryIds.length === 0) {
      return res.json([]);
    }

    const rawList = await Promise.all(categoryIds.map(id => valkey.call('JSON.GET', id)));
    const categories = rawList.map(raw => raw ? JSON.parse(raw) : null).filter(Boolean);

    return res.json(buildCategoryTree(categories));
  } catch (err) {
    console.error('[Categories] List error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/categories/{id}/products:
 *   get:
 *     tags: [Categories]
 *     summary: Get paginated products in a category (newest first)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated products in category
 */
router.get('/categories/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const total = await valkey.zcard(`category_products:${id}`);
    const productIds = await valkey.zrevrangebyscore(
      `category_products:${id}`, '+inf', '-inf', 'LIMIT', offset, limit,
    );

    if (productIds.length === 0) {
      return res.json({ data: [], page, limit, total });
    }

    const rawList = await Promise.all(productIds.map(pid => valkey.call('JSON.GET', pid)));
    const data = rawList.map(raw => raw ? JSON.parse(raw) : null).filter(Boolean);

    return res.json({ data, page, limit, total });
  } catch (err) {
    console.error('[Categories] Products error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/vendors/{id}:
 *   get:
 *     tags: [Vendors]
 *     summary: Get a single vendor by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vendor document
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       404:
 *         description: Vendor not found
 */
router.get('/vendors/:id', async (req, res) => {
  try {
    const raw = await valkey.call('JSON.GET', req.params.id);
    if (!raw) {
      return res.status(404).json({ error: 'not_found', message: 'Vendor not found' });
    }
    return res.json(JSON.parse(raw));
  } catch (err) {
    console.error('[Vendors] Get error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/vendors/{id}/products:
 *   get:
 *     tags: [Vendors]
 *     summary: Get paginated products by vendor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated products by vendor
 */
router.get('/vendors/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const productIds = await valkey.smembers(`vendor_products:${id}`);
    const total = productIds.length;

    if (productIds.length === 0) {
      return res.json({ data: [], page, limit, total });
    }

    const rawList = await Promise.all(productIds.map(pid => valkey.call('JSON.GET', pid)));
    let products = rawList.map(raw => raw ? JSON.parse(raw) : null).filter(Boolean);
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const data = products.slice(offset, offset + limit);
    return res.json({ data, page, limit, total });
  } catch (err) {
    console.error('[Vendors] Products error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/seed:
 *   post:
 *     tags: [Seed]
 *     summary: Seed Valkey with sample categories, vendors, and products
 *     responses:
 *       200:
 *         description: Seed complete with counts
 */
router.post('/seed', async (req, res) => {
  try {
    const VENDOR_1 = 'vendor:0192d4e7-4d5e-7b7c-9e9f-1a2b3c4d5e6f';
    const VENDOR_2 = 'vendor:0192d4e7-5e6f-7c8d-9f0a-2b3c4d5e6f7a';

    const CAT_ELECTRONICS   = 'category:0192d4e2-1f5a-7c3d-9b2e-8a4f6d0c1e3b';
    const CAT_SMARTPHONES   = 'category:0192d4e2-3a7b-7e1f-8c4d-2b6a9f0e5d7c';
    const CAT_LAPTOPS       = 'category:0192d4e2-4c8d-7a2e-9f1b-3d5c7e8a0b4f';
    const CAT_TVS           = 'category:0192d4e2-5d9e-7b3f-8a2c-4e6d1f9b0c5a';
    const CAT_AUDIO         = 'category:0192d4e2-6eaf-7c4a-9b3d-5f7e2a0c1d6b';
    const CAT_FASHION       = 'category:0192d4e3-7b1c-7d4e-8a2f-9c3b5d6e0f1a';
    const CAT_MENS          = 'category:0192d4e3-8c2d-7e5f-9b3a-0d4c6e7f1a2b';
    const CAT_WOMENS        = 'category:0192d4e3-9d3e-7f6a-8c4b-1e5d7f0a2b3c';
    const CAT_KIDS_FASHION  = 'category:0192d4e3-ae4f-7a7b-9d5c-2f6e8a1b3c4d';
    const CAT_HOME          = 'category:0192d4e4-1a2b-7c3d-8e4f-5a6b7c8d9e0f';
    const CAT_APPLIANCES    = 'category:0192d4e4-2b3c-7d4e-9f5a-6b7c8d9e0f1a';
    const CAT_COOKWARE      = 'category:0192d4e4-3c4d-7e5f-8a6b-7c8d9e0f1a2b';
    const CAT_FURNITURE     = 'category:0192d4e4-4d5e-7f6a-9b7c-8d9e0f1a2b3c';
    const CAT_SPORTS        = 'category:0192d4e5-5e6f-7a7b-8c8d-9e0f1a2b3c4d';
    const CAT_FITNESS       = 'category:0192d4e5-6f7a-7b8c-9d9e-0f1a2b3c4d5e';
    const CAT_CRICKET       = 'category:0192d4e5-7a8b-7c9d-8e0f-1a2b3c4d5e6f';
    const CAT_OUTDOOR       = 'category:0192d4e5-8b9c-7d0e-9f1a-2b3c4d5e6f7a';

    const categories = [
      { id: CAT_ELECTRONICS, name: 'Electronics', slug: 'electronics', icon: 'desktop', parentId: null, children: [CAT_SMARTPHONES, CAT_LAPTOPS, CAT_TVS, CAT_AUDIO] },
      { id: CAT_SMARTPHONES, name: 'Smartphones', slug: 'smartphones', icon: 'device-mobile', parentId: CAT_ELECTRONICS, children: [] },
      { id: CAT_LAPTOPS, name: 'Laptops', slug: 'laptops', icon: 'laptop', parentId: CAT_ELECTRONICS, children: [] },
      { id: CAT_TVS, name: 'Televisions', slug: 'televisions', icon: 'tv', parentId: CAT_ELECTRONICS, children: [] },
      { id: CAT_AUDIO, name: 'Audio', slug: 'audio', icon: 'headphones', parentId: CAT_ELECTRONICS, children: [] },
      { id: CAT_FASHION, name: 'Fashion', slug: 'fashion', icon: 't-shirt', parentId: null, children: [CAT_MENS, CAT_WOMENS, CAT_KIDS_FASHION] },
      { id: CAT_MENS, name: "Men's Fashion", slug: 'mens-fashion', icon: 'user', parentId: CAT_FASHION, children: [] },
      { id: CAT_WOMENS, name: "Women's Fashion", slug: 'womens-fashion', icon: 'user', parentId: CAT_FASHION, children: [] },
      { id: CAT_KIDS_FASHION, name: "Kids Fashion", slug: 'kids-fashion', icon: 'user', parentId: CAT_FASHION, children: [] },
      { id: CAT_HOME, name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'house', parentId: null, children: [CAT_APPLIANCES, CAT_COOKWARE, CAT_FURNITURE] },
      { id: CAT_APPLIANCES, name: 'Appliances', slug: 'appliances', icon: 'plug', parentId: CAT_HOME, children: [] },
      { id: CAT_COOKWARE, name: 'Cookware', slug: 'cookware', icon: 'flame', parentId: CAT_HOME, children: [] },
      { id: CAT_FURNITURE, name: 'Furniture', slug: 'furniture', icon: 'armchair', parentId: CAT_HOME, children: [] },
      { id: CAT_SPORTS, name: 'Sports & Outdoors', slug: 'sports-outdoors', icon: 'basketball', parentId: null, children: [CAT_FITNESS, CAT_CRICKET, CAT_OUTDOOR] },
      { id: CAT_FITNESS, name: 'Fitness', slug: 'fitness', icon: 'activity', parentId: CAT_SPORTS, children: [] },
      { id: CAT_CRICKET, name: 'Cricket', slug: 'cricket', icon: 'circle', parentId: CAT_SPORTS, children: [] },
      { id: CAT_OUTDOOR, name: 'Outdoor Gear', slug: 'outdoor-gear', icon: 'tent', parentId: CAT_SPORTS, children: [] },
    ];

    const vendors = [
      {
        id: VENDOR_1,
        name: 'TechWorld Electronics',
        slug: 'techworld-electronics',
        email: 'support@techworld.in',
        phone: '+91-4012345678',
        logo: '/assets/vendors/techworld-logo.png',
        rating: 4.7,
        totalProducts: 342,
        totalSales: 15420,
        address: { street: 'Plot 15, HITEC City', city: 'Hyderabad', state: 'Telangana', postalCode: '500081', country: 'IN', lat: 17.4435, lng: 78.3772 },
        verified: true,
        joinedAt: '2024-06-15T00:00:00Z',
      },
      {
        id: VENDOR_2,
        name: 'FashionHub India',
        slug: 'fashionhub-india',
        email: 'hello@fashionhub.in',
        phone: '+91-8012345678',
        logo: '/assets/vendors/fashionhub-logo.png',
        rating: 4.4,
        totalProducts: 215,
        totalSales: 8930,
        address: { street: '12 Commercial Street', city: 'Bengaluru', state: 'Karnataka', postalCode: '560001', country: 'IN', lat: 12.9716, lng: 77.5946 },
        verified: true,
        joinedAt: '2024-09-01T00:00:00Z',
      },
    ];

    const products = [
      {
        id: 'product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f',
        sku: 'ELEC-PHN-SAM-001',
        name: 'Galaxy Ultra Pro 256GB',
        slug: 'galaxy-ultra-pro-256gb',
        description: 'Flagship smartphone with 200MP camera, 6.8" AMOLED display, and 5000mAh battery.',
        shortDescription: '200MP camera, 6.8" AMOLED, 5000mAh',
        categoryId: CAT_SMARTPHONES,
        vendorId: VENDOR_1,
        brand: 'Samsung',
        price: { amount: 89999, currency: 'INR', compareAt: 99999 },
        images: [{ url: '/assets/products/galaxy-ultra-front.jpg', alt: 'Galaxy Ultra Pro front view', isPrimary: true }],
        attributes: { color: 'Phantom Black', storage: '256GB', ram: '12GB', display: '6.8 inch AMOLED', battery: '5000mAh', os: 'Android 15' },
        tags: ['smartphone', '5g', 'flagship', 'camera', 'samsung'],
        inventory: { quantity: 150, reserved: 12, warehouse: 'HYD-WH-01' },
        ratings: { average: 4.6, count: 2341 },
        status: 'active',
        createdAt: '2025-03-01T08:00:00Z',
        updatedAt: '2025-05-18T12:30:00Z',
      },
      {
        id: 'product:0192d4e6-3d5f-7b8c-9e0a-1b2c3d4e5f6a',
        sku: 'ELEC-PHN-APL-001',
        name: 'iPhone 15 Pro Max 256GB',
        slug: 'iphone-15-pro-max-256gb',
        description: 'Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, and ProRAW photography.',
        shortDescription: 'A17 Pro chip, titanium, 48MP ProRAW',
        categoryId: CAT_SMARTPHONES,
        vendorId: VENDOR_1,
        brand: 'Apple',
        price: { amount: 134999, currency: 'INR', compareAt: 149999 },
        images: [{ url: '/assets/products/iphone15-front.jpg', alt: 'iPhone 15 Pro Max', isPrimary: true }],
        attributes: { color: 'Natural Titanium', storage: '256GB', ram: '8GB', display: '6.7 inch Super Retina XDR', battery: '4422mAh', os: 'iOS 17' },
        tags: ['smartphone', '5g', 'flagship', 'apple', 'ios'],
        inventory: { quantity: 80, reserved: 5, warehouse: 'HYD-WH-01' },
        ratings: { average: 4.8, count: 1876 },
        status: 'active',
        createdAt: '2025-03-05T09:00:00Z',
        updatedAt: '2025-05-10T10:00:00Z',
      },
      {
        id: 'product:0192d4e6-4e6a-7c9d-8f1b-2c3d4e5f6a7b',
        sku: 'ELEC-LAP-DEL-001',
        name: 'Dell XPS 15 Laptop',
        slug: 'dell-xps-15-laptop',
        description: 'Premium 15-inch laptop with Intel Core i7, OLED display, and 32GB RAM.',
        shortDescription: 'Intel i7, OLED, 32GB RAM, 1TB SSD',
        categoryId: CAT_LAPTOPS,
        vendorId: VENDOR_1,
        brand: 'Dell',
        price: { amount: 115990, currency: 'INR', compareAt: 129990 },
        images: [{ url: '/assets/products/dell-xps15.jpg', alt: 'Dell XPS 15', isPrimary: true }],
        attributes: { processor: 'Intel Core i7-13700H', ram: '32GB DDR5', storage: '1TB NVMe SSD', display: '15.6 inch OLED', os: 'Windows 11 Pro' },
        tags: ['laptop', 'ultrabook', 'dell', 'oled', 'work'],
        inventory: { quantity: 45, reserved: 3, warehouse: 'HYD-WH-02' },
        ratings: { average: 4.5, count: 892 },
        status: 'active',
        createdAt: '2025-03-10T10:00:00Z',
        updatedAt: '2025-05-12T08:00:00Z',
      },
      {
        id: 'product:0192d4e6-5f7b-7d0e-8a2c-3d4e5f6a7b8c',
        sku: 'ELEC-LAP-APL-001',
        name: 'MacBook Pro M3 14"',
        slug: 'macbook-pro-m3-14',
        description: 'Apple MacBook Pro with M3 chip, Liquid Retina XDR display, and 18-hour battery life.',
        shortDescription: 'M3 chip, Liquid Retina XDR, 18hr battery',
        categoryId: CAT_LAPTOPS,
        vendorId: VENDOR_1,
        brand: 'Apple',
        price: { amount: 199990, currency: 'INR', compareAt: 219990 },
        images: [{ url: '/assets/products/macbook-pro-m3.jpg', alt: 'MacBook Pro M3', isPrimary: true }],
        attributes: { processor: 'Apple M3', ram: '18GB Unified Memory', storage: '512GB SSD', display: '14.2 inch Liquid Retina XDR', os: 'macOS Sonoma' },
        tags: ['laptop', 'macbook', 'apple', 'm3', 'creative'],
        inventory: { quantity: 30, reserved: 2, warehouse: 'HYD-WH-02' },
        ratings: { average: 4.9, count: 654 },
        status: 'active',
        createdAt: '2025-03-15T11:00:00Z',
        updatedAt: '2025-05-14T09:00:00Z',
      },
      {
        id: 'product:0192d4e6-6a8c-7e1f-9b3d-4e5f6a7b8c9d',
        sku: 'ELEC-TV-SNY-001',
        name: 'Sony Bravia 65" 4K OLED',
        slug: 'sony-bravia-65-4k-oled',
        description: 'Sony Bravia 65-inch 4K OLED TV with XR Processor and Dolby Vision.',
        shortDescription: '65" 4K OLED, XR Processor, Dolby Vision',
        categoryId: CAT_TVS,
        vendorId: VENDOR_1,
        brand: 'Sony',
        price: { amount: 74990, currency: 'INR', compareAt: 89990 },
        images: [{ url: '/assets/products/sony-bravia-65.jpg', alt: 'Sony Bravia 65 OLED', isPrimary: true }],
        attributes: { size: '65 inch', resolution: '4K UHD', panel: 'OLED', hdr: 'Dolby Vision', smartTv: 'Google TV' },
        tags: ['tv', '4k', 'oled', 'sony', 'smart-tv'],
        inventory: { quantity: 25, reserved: 1, warehouse: 'HYD-WH-03' },
        ratings: { average: 4.7, count: 412 },
        status: 'active',
        createdAt: '2025-03-20T12:00:00Z',
        updatedAt: '2025-05-16T10:00:00Z',
      },
      {
        id: 'product:0192d4e6-7b9d-7f2a-8c4e-5f6a7b8c9d0e',
        sku: 'ELEC-AUD-SNY-001',
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh-1000xm5-headphones',
        description: 'Industry-leading noise cancelling headphones with 30-hour battery and multipoint connection.',
        shortDescription: 'Best-in-class ANC, 30hr battery',
        categoryId: CAT_AUDIO,
        vendorId: VENDOR_1,
        brand: 'Sony',
        price: { amount: 27990, currency: 'INR', compareAt: 34990 },
        images: [{ url: '/assets/products/sony-xm5.jpg', alt: 'Sony WH-1000XM5', isPrimary: true }],
        attributes: { type: 'Over-ear', connectivity: 'Bluetooth 5.2', anc: 'Active Noise Cancelling', battery: '30 hours', foldable: 'Yes' },
        tags: ['headphones', 'anc', 'sony', 'wireless', 'audio'],
        inventory: { quantity: 120, reserved: 8, warehouse: 'HYD-WH-01' },
        ratings: { average: 4.7, count: 1823 },
        status: 'active',
        createdAt: '2025-03-25T13:00:00Z',
        updatedAt: '2025-05-18T11:00:00Z',
      },
      {
        id: 'product:0192d4e6-8cae-7a3b-9d5f-6a7b8c9d0e1f',
        sku: 'FASH-MEN-NIK-001',
        name: 'Nike Air Max 270 Running Shoes',
        slug: 'nike-air-max-270-running-shoes',
        description: 'Nike Air Max 270 with Max Air unit and breathable mesh upper for all-day comfort.',
        shortDescription: 'Max Air unit, breathable mesh',
        categoryId: CAT_MENS,
        vendorId: VENDOR_2,
        brand: 'Nike',
        price: { amount: 9995, currency: 'INR', compareAt: 12995 },
        images: [{ url: '/assets/products/nike-am270.jpg', alt: 'Nike Air Max 270', isPrimary: true }],
        attributes: { size: 'UK 8', color: 'Black/White', material: 'Mesh', sole: 'Air Max unit', gender: 'Men' },
        tags: ['shoes', 'running', 'nike', 'sports', 'footwear'],
        inventory: { quantity: 200, reserved: 15, warehouse: 'BLR-WH-01' },
        ratings: { average: 4.4, count: 3210 },
        status: 'active',
        createdAt: '2025-04-01T09:00:00Z',
        updatedAt: '2025-05-01T08:00:00Z',
      },
      {
        id: 'product:0192d4e6-9dbf-7b4c-8e6a-7b8c9d0e1f2a',
        sku: 'FASH-WOM-HNM-001',
        name: 'H&M Floral Summer Dress',
        slug: 'hm-floral-summer-dress',
        description: 'Light and airy floral print summer dress in sustainable cotton blend.',
        shortDescription: 'Sustainable cotton, floral print',
        categoryId: CAT_WOMENS,
        vendorId: VENDOR_2,
        brand: 'H&M',
        price: { amount: 2999, currency: 'INR', compareAt: 3999 },
        images: [{ url: '/assets/products/hm-floral-dress.jpg', alt: 'H&M Floral Summer Dress', isPrimary: true }],
        attributes: { size: 'M', color: 'Multicolor Floral', material: 'Cotton Blend', fit: 'Regular', occasion: 'Casual' },
        tags: ['dress', 'summer', 'floral', 'women', 'casual'],
        inventory: { quantity: 300, reserved: 20, warehouse: 'BLR-WH-01' },
        ratings: { average: 4.2, count: 876 },
        status: 'active',
        createdAt: '2025-04-05T10:00:00Z',
        updatedAt: '2025-05-05T09:00:00Z',
      },
      {
        id: 'product:0192d4e6-aec0-7c5d-9f7b-8c9d0e1f2a3b',
        sku: 'HOME-APP-INP-001',
        name: 'Instant Pot Duo 7-in-1 6L',
        slug: 'instant-pot-duo-7in1-6l',
        description: 'Multi-use programmable pressure cooker — replaces 7 kitchen appliances.',
        shortDescription: '7-in-1, 6L, 14 one-touch smart programs',
        categoryId: CAT_APPLIANCES,
        vendorId: VENDOR_2,
        brand: 'Instant Pot',
        price: { amount: 9999, currency: 'INR', compareAt: 12999 },
        images: [{ url: '/assets/products/instant-pot-duo.jpg', alt: 'Instant Pot Duo 6L', isPrimary: true }],
        attributes: { capacity: '6 Litres', functions: '7-in-1', programs: 14, material: 'Stainless Steel', warranty: '1 year' },
        tags: ['pressure-cooker', 'instant-pot', 'kitchen', 'appliance', 'cooking'],
        inventory: { quantity: 75, reserved: 4, warehouse: 'BLR-WH-02' },
        ratings: { average: 4.6, count: 2145 },
        status: 'active',
        createdAt: '2025-04-10T11:00:00Z',
        updatedAt: '2025-05-10T10:00:00Z',
      },
      {
        id: 'product:0192d4e6-bfd1-7d6e-8a8c-9d0e1f2a3b4c',
        sku: 'HOME-CKW-LDG-001',
        name: 'Lodge 10" Cast Iron Skillet',
        slug: 'lodge-10-cast-iron-skillet',
        description: 'Pre-seasoned cast iron skillet for superior heat retention and even cooking.',
        shortDescription: 'Pre-seasoned, 10 inch, oven safe',
        categoryId: CAT_COOKWARE,
        vendorId: VENDOR_2,
        brand: 'Lodge',
        price: { amount: 3999, currency: 'INR', compareAt: 4999 },
        images: [{ url: '/assets/products/lodge-skillet.jpg', alt: 'Lodge Cast Iron Skillet', isPrimary: true }],
        attributes: { size: '10 inch', material: 'Cast Iron', preseasoned: 'Yes', ovenSafe: 'Yes', inductionCompatible: 'Yes' },
        tags: ['cookware', 'cast-iron', 'skillet', 'kitchen', 'lodge'],
        inventory: { quantity: 90, reserved: 6, warehouse: 'BLR-WH-02' },
        ratings: { average: 4.8, count: 1342 },
        status: 'active',
        createdAt: '2025-04-15T12:00:00Z',
        updatedAt: '2025-05-12T11:00:00Z',
      },
      {
        id: 'product:0192d4e6-c0e2-7e7f-9b9d-0e1f2a3b4c5d',
        sku: 'SPRT-CRK-NIV-001',
        name: 'Nivia Junior Cricket Kit',
        slug: 'nivia-junior-cricket-kit',
        description: 'Complete junior cricket kit with bat, ball, pads, gloves, and helmet for ages 8-14.',
        shortDescription: 'Complete kit for ages 8-14',
        categoryId: CAT_CRICKET,
        vendorId: VENDOR_2,
        brand: 'Nivia',
        price: { amount: 4299, currency: 'INR', compareAt: 5499 },
        images: [{ url: '/assets/products/nivia-cricket-kit.jpg', alt: 'Nivia Junior Cricket Kit', isPrimary: true }],
        attributes: { ageGroup: '8-14 years', includes: 'Bat, Ball, Pads, Gloves, Helmet', material: 'Willow + PU', level: 'Beginner' },
        tags: ['cricket', 'junior', 'sports', 'nivia', 'kids'],
        inventory: { quantity: 55, reserved: 3, warehouse: 'BLR-WH-02' },
        ratings: { average: 4.3, count: 567 },
        status: 'active',
        createdAt: '2025-04-20T09:00:00Z',
        updatedAt: '2025-05-15T10:00:00Z',
      },
      {
        id: 'product:0192d4e6-d1f3-7f8a-8c0e-1f2a3b4c5d6e',
        sku: 'ELEC-TAB-SAM-001',
        name: 'Samsung Galaxy Tab S9 256GB',
        slug: 'samsung-galaxy-tab-s9-256gb',
        description: 'Samsung Galaxy Tab S9 with Snapdragon 8 Gen 2, Dynamic AMOLED 2X display, and S Pen included.',
        shortDescription: 'Snapdragon 8 Gen 2, AMOLED 2X, S Pen',
        categoryId: CAT_SMARTPHONES,
        vendorId: VENDOR_1,
        brand: 'Samsung',
        price: { amount: 79999, currency: 'INR', compareAt: 89999 },
        images: [{ url: '/assets/products/samsung-tab-s9.jpg', alt: 'Samsung Galaxy Tab S9', isPrimary: true }],
        attributes: { display: '11 inch AMOLED 2X', processor: 'Snapdragon 8 Gen 2', ram: '12GB', storage: '256GB', sPen: 'Included', os: 'Android 13' },
        tags: ['tablet', 'samsung', 'android', 's-pen', 'amoled'],
        inventory: { quantity: 60, reserved: 7, warehouse: 'HYD-WH-01' },
        ratings: { average: 4.5, count: 983 },
        status: 'active',
        createdAt: '2025-04-25T10:00:00Z',
        updatedAt: '2025-05-20T09:00:00Z',
      },
    ];

    const ops = [];

    // Store categories + update all_categories index
    for (const cat of categories) {
      ops.push(valkey.call('JSON.SET', cat.id, '$', JSON.stringify(cat)));
      ops.push(valkey.sadd('all_categories', cat.id));
    }

    // Store vendors + update all_vendors index
    for (const vendor of vendors) {
      ops.push(valkey.call('JSON.SET', vendor.id, '$', JSON.stringify(vendor)));
      ops.push(valkey.sadd('all_vendors', vendor.id));
    }

    // Store products + update all indexes
    for (const product of products) {
      const timestamp = new Date(product.createdAt).getTime();
      ops.push(valkey.call('JSON.SET', product.id, '$', JSON.stringify(product)));
      ops.push(valkey.zadd(`category_products:${product.categoryId}`, timestamp, product.id));
      ops.push(valkey.sadd(`brand_products:${product.brand.toLowerCase()}`, product.id));
      ops.push(valkey.zadd('price_index', product.price.amount, product.id));
      ops.push(valkey.sadd(`vendor_products:${product.vendorId}`, product.id));
      ops.push(valkey.zadd('all_products', timestamp, product.id));
    }

    await Promise.all(ops);

    return res.json({
      message: 'Seed complete',
      counts: {
        categories: categories.length,
        vendors: vendors.length,
        products: products.length,
      },
    });
  } catch (err) {
    console.error('[Seed] Error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

module.exports = router;
