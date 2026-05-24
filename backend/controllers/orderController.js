const { client } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const orderController = {
  createOrder: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      const { paymentMethod, billingAddress } = req.body;

      // 1. Get user cart
      let cart = await client.json.get(`cart:${userId}`);
      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // 2. Calculate totals and check stock
      let subtotal = 0;
      const orderItems = [];
      
      for (const item of cart.items) {
        const product = await client.json.get(`product:${item.productId}`);
        if (!product) continue;
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Not enough stock for ${product.name}` });
        }
        
        // Update product stock and sold count
        product.stock -= item.quantity;
        product.sold += item.quantity;
        await client.json.set(`product:${product.id}`, '$', product);
        
        const price = product.price || 0;
        subtotal += price * item.quantity;
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: price,
          quantity: item.quantity,
          subtotal: price * item.quantity
        });
      }

      const orderId = uuidv4();
      const tax = Number((subtotal * 0.1).toFixed(2));
      const total = Number((subtotal + tax).toFixed(2));

      const order = {
        id: orderId,
        userId,
        items: orderItems,
        subtotal,
        tax,
        delivery: 0,
        total,
        paymentMethod,
        billingAddress,
        status: 'Processing',
        createdAt: new Date().toISOString()
      };

      // 3. Save order
      await client.json.set(`order:${orderId}`, '$', order);
      await client.zAdd(`user_orders:${userId}`, { score: Date.now(), value: orderId });

      // 4. Clear cart
      await client.json.set(`cart:${userId}`, '$', { items: [] });

      // 5. Update analytics
      await client.hIncrBy('analytics:dashboard', 'totalOrders', 1);
      await client.hIncrByFloat('analytics:dashboard', 'totalRevenue', total);

      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getOrders: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      const orderIds = await client.zRange(`user_orders:${userId}`, 0, -1, { REV: true });
      
      const orders = [];
      for (const id of orderIds) {
        const order = await client.json.get(`order:${id}`);
        if (order) orders.push(order);
      }
      
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await client.json.get(`order:${id}`);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = orderController;
