const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../config/valkey');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/orders
 * Place a new order (protected)
 */
router.post('/', authenticate, async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
    return res.status(400).json({ error: 'Shipping address is required' });
  }

  const valkey = getClient();

  try {
    const orderId = uuidv4().split('-')[0].toUpperCase(); // Short order ID like "A3F2B1C9"
    const username = req.user.username;

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId || uuidv4().split('-')[0],
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        total: itemTotal
      };
    });

    const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    const order = {
      id: orderId,
      username,
      items: JSON.stringify(orderItems),
      shippingAddress: JSON.stringify(shippingAddress),
      paymentMethod: paymentMethod || 'Cash on delivery',
      notes: notes || '',
      subtotal,
      tax,
      shipping,
      total,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store order in Valkey hash
    await valkey.hset(`order:${orderId}`, order);

    // Add order ID to user's order list (sorted set with timestamp as score)
    await valkey.zadd(`orders:${username}`, Date.now(), orderId);

    // Update inventory (decrement stock for each item)
    for (const item of orderItems) {
      const currentStock = await valkey.get(`inventory:${item.productId}`);
      if (currentStock !== null) {
        const newStock = Math.max(0, parseInt(currentStock) - item.quantity);
        await valkey.set(`inventory:${item.productId}`, newStock);
      }
    }

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: orderId,
        items: orderItems,
        shippingAddress,
        paymentMethod: order.paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

/**
 * GET /api/orders
 * Get all orders for the current user (protected)
 */
router.get('/', authenticate, async (req, res) => {
  const valkey = getClient();
  const username = req.user.username;

  try {
    // Get order IDs sorted by most recent first
    const orderIds = await valkey.zrevrange(`orders:${username}`, 0, -1);

    if (!orderIds.length) {
      return res.json({ orders: [] });
    }

    const orders = [];
    for (const orderId of orderIds) {
      const orderData = await valkey.hgetall(`order:${orderId}`);
      if (orderData && orderData.id) {
        orders.push({
          id: orderData.id,
          items: JSON.parse(orderData.items),
          shippingAddress: JSON.parse(orderData.shippingAddress),
          paymentMethod: orderData.paymentMethod,
          subtotal: parseFloat(orderData.subtotal),
          tax: parseFloat(orderData.tax),
          shipping: parseFloat(orderData.shipping),
          total: parseFloat(orderData.total),
          status: orderData.status,
          notes: orderData.notes,
          createdAt: orderData.createdAt,
          updatedAt: orderData.updatedAt
        });
      }
    }

    res.json({ orders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/:id
 * Get a single order by ID (protected)
 */
router.get('/:id', authenticate, async (req, res) => {
  const valkey = getClient();
  const orderId = req.params.id;

  try {
    const orderData = await valkey.hgetall(`order:${orderId}`);

    if (!orderData || !orderData.id) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify the order belongs to this user
    if (orderData.username !== req.user.username) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      order: {
        id: orderData.id,
        items: JSON.parse(orderData.items),
        shippingAddress: JSON.parse(orderData.shippingAddress),
        paymentMethod: orderData.paymentMethod,
        subtotal: parseFloat(orderData.subtotal),
        tax: parseFloat(orderData.tax),
        shipping: parseFloat(orderData.shipping),
        total: parseFloat(orderData.total),
        status: orderData.status,
        notes: orderData.notes,
        createdAt: orderData.createdAt,
        updatedAt: orderData.updatedAt
      }
    });
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
