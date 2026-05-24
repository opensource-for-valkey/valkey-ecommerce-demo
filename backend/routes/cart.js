const express = require('express');
const router = express.Router();
const valkey = require('../lib/valkey');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const CART_TTL = 604800;

function getCartKey(req) {
  if (req.userId) return `cart:${req.userId}`;
  const guestId = req.headers['x-guest-id'];
  if (guestId) return `cart:guest:${guestId}`;
  return null;
}

function computeDiscount(coupon, subtotal, items) {
  if (!coupon.active) return 0;
  if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) return 0;
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) return 0;

  let eligibleSubtotal = subtotal;
  if (coupon.applicableCategories?.length) {
    eligibleSubtotal = items
      .filter(i => coupon.applicableCategories.includes(i.categoryId))
      .reduce((sum, i) => sum + i.subtotal, 0);
    if (eligibleSubtotal === 0) return 0;
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Math.floor(eligibleSubtotal * coupon.value / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else if (coupon.type === 'fixed') {
    discount = Math.min(coupon.value, eligibleSubtotal);
  }
  return discount;
}

async function buildCartItems(hash) {
  const items = [];
  let subtotal = 0;
  for (const [productId, qty] of Object.entries(hash)) {
    const raw = await valkey.call('JSON.GET', productId);
    if (!raw) continue;
    let product;
    try {
      const parsed = JSON.parse(raw);
      product = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch { continue; }
    const quantity = parseInt(qty, 10);
    const price = product.price?.amount || 0;
    items.push({
      productId,
      name: product.name,
      brand: product.brand,
      price,
      quantity,
      subtotal: price * quantity,
      image: product.images?.[0]?.url || null,
      categoryId: product.categoryId,
    });
    subtotal += price * quantity;
  }
  return { items, subtotal };
}

async function buildCartResponse(cartKey, couponCode = null) {
  const hash = await valkey.hgetall(cartKey);
  if (!hash) {
    return { items: [], itemCount: 0, subtotal: 0, discount: 0, total: 0, coupon: null };
  }

  const { items, subtotal } = await buildCartItems(hash);

  let discount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const couponRaw = await valkey.call('JSON.GET', `coupon:${couponCode.toUpperCase()}`);
    if (couponRaw) {
      let coupon;
      try {
        const parsed = JSON.parse(couponRaw);
        coupon = Array.isArray(parsed) ? parsed[0] : parsed;
      } catch { coupon = null; }
      if (coupon) {
        discount = computeDiscount(coupon, subtotal, items);
        appliedCoupon = {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          discount,
          description: coupon.description || '',
        };
      }
    }
  }

  return {
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    coupon: appliedCoupon,
  };
}

/**
 * @openapi
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current cart
 *     security: [{}]
 *     parameters:
 *       - in: header
 *         name: X-Guest-Id
 *         schema: { type: string }
 *         description: Guest session ID (used when not authenticated)
 *     responses:
 *       200:
 *         description: Cart contents
 */
router.get('/cart', optionalAuth, async (req, res) => {
  try {
    const cartKey = getCartKey(req);
    if (!cartKey) return res.json({ items: [], itemCount: 0, subtotal: 0, discount: 0, total: 0, coupon: null });
    const couponCode = await valkey.get(`cart_coupon:${cartKey}`);
    res.json(await buildCartResponse(cartKey, couponCode));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @openapi
 * /api/cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.post('/cart/items', optionalAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: 'validation_error', message: 'productId required' });
    if (parseInt(quantity, 10) < 1) return res.status(400).json({ error: 'validation_error', message: 'quantity must be >= 1' });

    const cartKey = getCartKey(req);
    if (!cartKey) return res.status(400).json({ error: 'no_cart_key', message: 'Provide Authorization or X-Guest-Id header' });

    const exists = await valkey.call('JSON.GET', productId);
    if (!exists) return res.status(404).json({ error: 'not_found', message: 'Product not found' });

    const existing = await valkey.hget(cartKey, productId);
    const newQty = (existing ? parseInt(existing, 10) : 0) + parseInt(quantity, 10);
    await valkey.hset(cartKey, productId, newQty);
    await valkey.expire(cartKey, CART_TTL);

    const couponCode = await valkey.get(`cart_coupon:${cartKey}`);
    res.json(await buildCartResponse(cartKey, couponCode));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @openapi
 * /api/cart/items/{productId}:
 *   patch:
 *     tags: [Cart]
 *     summary: Update item quantity
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.patch('/cart/items/:productId', optionalAuth, async (req, res) => {
  try {
    const productId = decodeURIComponent(req.params.productId);
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ error: 'validation_error', message: 'quantity required' });

    const cartKey = getCartKey(req);
    if (!cartKey) return res.status(400).json({ error: 'no_cart_key', message: 'Provide Authorization or X-Guest-Id header' });

    if (parseInt(quantity, 10) <= 0) {
      await valkey.hdel(cartKey, productId);
    } else {
      await valkey.hset(cartKey, productId, parseInt(quantity, 10));
      await valkey.expire(cartKey, CART_TTL);
    }

    const couponCode = await valkey.get(`cart_coupon:${cartKey}`);
    res.json(await buildCartResponse(cartKey, couponCode));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @openapi
 * /api/cart/items/{productId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.delete('/cart/items/:productId', optionalAuth, async (req, res) => {
  try {
    const productId = decodeURIComponent(req.params.productId);
    const cartKey = getCartKey(req);
    if (!cartKey) return res.status(400).json({ error: 'no_cart_key', message: 'Provide Authorization or X-Guest-Id header' });

    await valkey.hdel(cartKey, productId);

    const couponCode = await valkey.get(`cart_coupon:${cartKey}`);
    res.json(await buildCartResponse(cartKey, couponCode));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @openapi
 * /api/cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear entire cart
 *     responses:
 *       200:
 *         description: Empty cart
 */
router.delete('/cart', optionalAuth, async (req, res) => {
  try {
    const cartKey = getCartKey(req);
    if (!cartKey) return res.status(400).json({ error: 'no_cart_key', message: 'Provide Authorization or X-Guest-Id header' });

    await valkey.del(cartKey);
    await valkey.del(`cart_coupon:${cartKey}`);
    res.json({ items: [], itemCount: 0, subtotal: 0, discount: 0, total: 0, coupon: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @openapi
 * /api/cart/coupon:
 *   post:
 *     tags: [Cart]
 *     summary: Apply a coupon code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code: { type: string, example: VALKEY10 }
 *     responses:
 *       200:
 *         description: Cart with discount applied
 *       400:
 *         description: Invalid or inapplicable coupon
 */
router.post('/cart/coupon', optionalAuth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'validation_error', message: 'Coupon code required' });

    const cartKey = getCartKey(req);
    if (!cartKey) return res.status(400).json({ error: 'no_cart_key', message: 'Provide Authorization or X-Guest-Id header' });

    const upperCode = code.toUpperCase();
    const couponRaw = await valkey.call('JSON.GET', `coupon:${upperCode}`);
    if (!couponRaw) return res.status(404).json({ error: 'invalid_coupon', message: 'Coupon not found' });

    let coupon;
    try {
      const parsed = JSON.parse(couponRaw);
      coupon = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      return res.status(400).json({ error: 'invalid_coupon', message: 'Invalid coupon data' });
    }

    if (!coupon.active) return res.status(400).json({ error: 'coupon_inactive', message: 'Coupon is not active' });
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return res.status(400).json({ error: 'coupon_expired', message: 'Coupon has expired' });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'coupon_exhausted', message: 'Coupon usage limit reached' });
    }

    if (req.userId) {
      const alreadyUsed = await valkey.sismember(`coupon_used:${upperCode}`, req.userId);
      if (alreadyUsed) {
        return res.status(400).json({ error: 'coupon_already_used', message: 'You have already used this coupon' });
      }
    }

    const hash = await valkey.hgetall(cartKey);
    if (!hash) return res.status(400).json({ error: 'empty_cart', message: 'Cart is empty' });

    const { items, subtotal } = await buildCartItems(hash);

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        error: 'min_order_not_met',
        message: `Minimum order amount is ₹${Number(coupon.minOrderAmount).toLocaleString('en-IN')}`,
      });
    }

    const discount = computeDiscount(coupon, subtotal, items);
    if (discount === 0 && coupon.applicableCategories?.length) {
      return res.status(400).json({ error: 'not_applicable', message: 'Coupon is not applicable to items in your cart' });
    }

    await valkey.set(`cart_coupon:${cartKey}`, upperCode);
    await valkey.expire(`cart_coupon:${cartKey}`, CART_TTL);

    // Record usage so the duplicate-use and limit checks work
    if (req.userId) {
      await valkey.sadd(`coupon_used:${upperCode}`, req.userId);
    }
    await valkey.call('JSON.NUMINCRBY', `coupon:${upperCode}`, '$.usedCount', 1);

    res.json(await buildCartResponse(cartKey, upperCode));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @openapi
 * /api/cart/coupon:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove applied coupon
 *     responses:
 *       200:
 *         description: Cart without discount
 */
router.delete('/cart/coupon', optionalAuth, async (req, res) => {
  try {
    const cartKey = getCartKey(req);
    if (!cartKey) return res.status(400).json({ error: 'no_cart_key', message: 'Provide Authorization or X-Guest-Id header' });
    await valkey.del(`cart_coupon:${cartKey}`);
    res.json(await buildCartResponse(cartKey, null));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @openapi
 * /api/cart/merge:
 *   post:
 *     tags: [Cart]
 *     summary: Merge guest cart into authenticated user cart
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guestId]
 *             properties:
 *               guestId: { type: string }
 *     responses:
 *       200:
 *         description: Merged cart
 */
router.post('/cart/merge', requireAuth, async (req, res) => {
  try {
    const { guestId } = req.body;
    if (!guestId) return res.status(400).json({ error: 'validation_error', message: 'guestId required' });

    const guestKey = `cart:guest:${guestId}`;
    const userKey = `cart:${req.userId}`;

    const guestHash = await valkey.hgetall(guestKey);
    if (guestHash) {
      for (const [productId, qty] of Object.entries(guestHash)) {
        await valkey.hincrby(userKey, productId, parseInt(qty, 10));
      }
      await valkey.expire(userKey, CART_TTL);

      const guestCoupon = await valkey.get(`cart_coupon:${guestKey}`);
      const userCoupon = await valkey.get(`cart_coupon:${userKey}`);
      if (guestCoupon && !userCoupon) {
        await valkey.set(`cart_coupon:${userKey}`, guestCoupon);
        await valkey.expire(`cart_coupon:${userKey}`, CART_TTL);
      }
      await valkey.del(guestKey);
      await valkey.del(`cart_coupon:${guestKey}`);
    }

    const couponCode = await valkey.get(`cart_coupon:${userKey}`);
    res.json(await buildCartResponse(userKey, couponCode));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

/**
 * @openapi
 * /api/seed/coupons:
 *   post:
 *     tags: [Seed]
 *     summary: Seed demo coupon codes
 *     responses:
 *       200:
 *         description: Seeded coupon codes
 */
router.post('/seed/coupons', async (req, res) => {
  try {
    const allCategoryIds = await valkey.smembers('all_categories');

    const catNames = {};
    for (const catId of allCategoryIds) {
      const raw = await valkey.call('JSON.GET', catId, '$.name');
      if (raw) {
        const names = JSON.parse(raw);
        if (names[0]) catNames[catId] = names[0].toLowerCase();
      }
    }

    const electronicsCats = allCategoryIds.filter(id => {
      const n = catNames[id] || '';
      return n.includes('electronic') || n.includes('phone') || n.includes('laptop') || n.includes('computer') || n.includes('tablet');
    });

    const fashionCats = allCategoryIds.filter(id => {
      const n = catNames[id] || '';
      return n.includes('fashion') || n.includes('clothing') || n.includes('apparel') || n.includes('sport') || n.includes('wear');
    });

    const coupons = [
      {
        code: 'VALKEY10',
        type: 'percentage',
        value: 10,
        maxDiscount: 2000,
        minOrderAmount: 5000,
        usageLimit: 1000,
        usedCount: 0,
        active: true,
        validFrom: '2025-01-01T00:00:00Z',
        validUntil: '2027-12-31T23:59:59Z',
        applicableCategories: [],
        description: '10% off on orders above ₹5,000 (max ₹2,000)',
      },
      {
        code: 'SAVE500',
        type: 'fixed',
        value: 500,
        maxDiscount: 500,
        minOrderAmount: 3000,
        usageLimit: 500,
        usedCount: 0,
        active: true,
        validFrom: '2025-01-01T00:00:00Z',
        validUntil: '2027-12-31T23:59:59Z',
        applicableCategories: [],
        description: 'Flat ₹500 off on orders above ₹3,000',
      },
      {
        code: 'ELECTRONICS20',
        type: 'percentage',
        value: 20,
        maxDiscount: 5000,
        minOrderAmount: 10000,
        usageLimit: 200,
        usedCount: 0,
        active: true,
        validFrom: '2025-01-01T00:00:00Z',
        validUntil: '2027-12-31T23:59:59Z',
        applicableCategories: electronicsCats,
        description: '20% off on Electronics above ₹10,000 (max ₹5,000)',
      },
      {
        code: 'FASHION15',
        type: 'percentage',
        value: 15,
        maxDiscount: 3000,
        minOrderAmount: 2000,
        usageLimit: 300,
        usedCount: 0,
        active: true,
        validFrom: '2025-01-01T00:00:00Z',
        validUntil: '2027-12-31T23:59:59Z',
        applicableCategories: fashionCats,
        description: '15% off on Fashion items above ₹2,000 (max ₹3,000)',
      },
    ];

    for (const coupon of coupons) {
      await valkey.call('JSON.SET', `coupon:${coupon.code}`, '$', JSON.stringify(coupon));
    }

    res.json({ seeded: coupons.map(c => ({ code: c.code, description: c.description })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

module.exports = router;
