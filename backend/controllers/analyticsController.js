const { client } = require('../config/db');
const { getIo } = require('../socket/liveEngine');

const analyticsController = {
  trackView: async (req, res) => {
    try {
      const { productId } = req.body;
      if (productId) {
        const newScore = await client.zIncrBy('products_by_views', 1, String(productId));
        
        // Emit live trend updates via Socket.io
        try {
          const io = getIo();
          io.emit('trends_update', { productId, views: newScore, timestamp: Date.now() });
          
          // Also track active users overall (simplified)
          const activeUsers = io.engine.clientsCount;
          io.emit('analytics_active_users', { count: activeUsers });
        } catch (socketErr) {
          console.error("Socket error in trackView:", socketErr.message);
        }
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error tracking view:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  trackCartAdd: async (req, res) => {
    try {
      // Simulate real-time revenue tracking
      await client.hIncrBy('analytics:dashboard', 'totalCartAdds', 1);
      
      try {
        const io = getIo();
        io.emit('analytics_cart_add', { timestamp: Date.now() });
      } catch (err) {}
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getDashboard: async (req, res) => {
    try {
      const dashboard = await client.hGetAll('analytics:dashboard');
      // Also get top trending products
      const topProducts = await client.zRangeWithScores('products_by_views', 0, 4, { REV: true });
      
      const hydratedTop = [];
      for (const tp of topProducts) {
        const productData = await client.json.get(`product:${tp.value}`);
        if (productData) {
           hydratedTop.push({ ...productData, views: tp.score });
        }
      }

      res.status(200).json({
        totalOrders: dashboard.totalOrders || 0,
        totalRevenue: dashboard.totalRevenue || 0,
        totalCartAdds: dashboard.totalCartAdds || 0,
        topTrending: hydratedTop
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = analyticsController;
