const { client } = require('../config/db');

// Helper to calculate totals
const calculateCartTotals = async (items) => {
  let subtotal = 0;
  const populatedItems = [];
  
  for (const item of items) {
    const product = await client.json.get(`product:${item.productId}`);
    if (product) {
      const price = product.price || 0;
      subtotal += price * item.quantity;
      populatedItems.push({ ...product, quantity: item.quantity, subtotal: price * item.quantity });
    }
  }
  
  return {
    items: populatedItems,
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number((subtotal * 0.1).toFixed(2)), // 10% tax mock
    delivery: 0,
    total: Number((subtotal * 1.1).toFixed(2))
  };
};

const cartController = {
  getCart: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      let cart = await client.json.get(`cart:${userId}`);
      
      if (!cart) {
        cart = { items: [] };
        await client.json.set(`cart:${userId}`, '$', cart);
      }
      
      const detailedCart = await calculateCartTotals(cart.items);
      res.status(200).json(detailedCart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  addToCart: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      const { productId, quantity = 1 } = req.body;
      
      let cart = await client.json.get(`cart:${userId}`);
      if (!cart) cart = { items: [] };
      
      const existingItem = cart.items.find(i => i.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      
      await client.json.set(`cart:${userId}`, '$', cart);
      
      const detailedCart = await calculateCartTotals(cart.items);
      res.status(200).json(detailedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  updateQuantity: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      const { productId, quantity } = req.body;
      
      let cart = await client.json.get(`cart:${userId}`);
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
      
      const item = cart.items.find(i => i.productId === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          cart.items = cart.items.filter(i => i.productId !== productId);
        }
        await client.json.set(`cart:${userId}`, '$', cart);
      }
      
      const detailedCart = await calculateCartTotals(cart.items);
      res.status(200).json(detailedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      const { productId } = req.params;
      
      let cart = await client.json.get(`cart:${userId}`);
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
      
      cart.items = cart.items.filter(i => i.productId !== productId);
      await client.json.set(`cart:${userId}`, '$', cart);
      
      const detailedCart = await calculateCartTotals(cart.items);
      res.status(200).json(detailedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  clearCart: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      await client.json.set(`cart:${userId}`, '$', { items: [] });
      res.status(200).json({ items: [], subtotal: 0, tax: 0, delivery: 0, total: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = cartController;
