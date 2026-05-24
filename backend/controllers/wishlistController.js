const { client } = require('../config/db');

const wishlistController = {
  getWishlist: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      let wishlist = await client.json.get(`wishlist:${userId}`);
      
      if (!wishlist) {
        wishlist = { items: [] };
        await client.json.set(`wishlist:${userId}`, '$', wishlist);
      }
      
      const populatedItems = [];
      for (const productId of wishlist.items) {
        const product = await client.json.get(`product:${productId}`);
        if (product) populatedItems.push(product);
      }
      
      res.status(200).json(populatedItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  addToWishlist: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      const { productId } = req.body;
      
      let wishlist = await client.json.get(`wishlist:${userId}`);
      if (!wishlist) wishlist = { items: [] };
      
      if (!wishlist.items.includes(productId)) {
        wishlist.items.push(productId);
        await client.json.set(`wishlist:${userId}`, '$', wishlist);
      }
      
      res.status(200).json({ message: 'Added to wishlist', items: wishlist.items });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  removeFromWishlist: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      const { productId } = req.params;
      
      let wishlist = await client.json.get(`wishlist:${userId}`);
      if (wishlist) {
        wishlist.items = wishlist.items.filter(id => id !== productId);
        await client.json.set(`wishlist:${userId}`, '$', wishlist);
      }
      
      res.status(200).json({ message: 'Removed from wishlist', items: wishlist?.items || [] });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = wishlistController;
