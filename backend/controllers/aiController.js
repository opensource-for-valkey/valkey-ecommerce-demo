const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const vectorSearchService = require('../services/vectorSearchService');
const { client } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const aiController = {
  // Conversational AI Assistant endpoint
  chat: async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      const sid = sessionId || req.headers['x-session-id'] || 'guest_chat';
      
      // 1. Retrieve Conversation History from Valkey
      let history = await client.json.get(`chat_history:${sid}`);
      if (!history) {
        history = { messages: [] };
      }
      
      // 2. Append user message
      history.messages.push({ role: 'user', content: message, timestamp: Date.now() });
      
      // 3. Fetch live platform context from Valkey to inject into AI brain
      let systemContext = "";
      try {
        // Fetch top 5 trending products from Valkey Sorted Set
        const trendingIds = await client.zRange('products_by_views', 0, 4, { REV: true });
        const trendingProducts = [];
        for (const id of trendingIds) {
          const prod = await client.json.get(`product:${id}`);
          if (prod) {
            trendingProducts.push(`"${prod.name}" (Price: $${prod.price}, Category: ${prod.category}, Brand: ${prod.brand}, Stock: ${prod.stock}, Sold: ${prod.sold}, ID: ${prod.id})`);
          }
        }

        // Fetch user's cart items from Valkey JSON
        const userId = sid.split('_')[0] || 'guest';
        const cart = await client.json.get(`cart:${userId}`);
        const cartItems = [];
        if (cart && cart.items) {
          for (const item of cart.items) {
            const prod = await client.json.get(`product:${item.productId}`);
            if (prod) {
              cartItems.push(`"${prod.name}" (Quantity: ${item.quantity}, Subtotal: $${(prod.price * item.quantity).toFixed(2)})`);
            }
          }
        }

        systemContext = `
[LIVE PLATFORM TRENDING PRODUCTS (FROM VALKEY ZSET 'products_by_views')]:
${trendingProducts.length > 0 ? trendingProducts.map((p, idx) => `   - ${idx + 1}. ${p}`).join('\n') : '   - (No trending products logged yet)'}

[USER ACTIVE CART CONTENT (FROM VALKEY JSON 'cart:${userId}')]:
${cartItems.length > 0 ? cartItems.map(item => `   - ${item}`).join('\n') : '   - (User\'s cart is currently empty)'}
`;
      } catch (ctxErr) {
        console.error("Failed to build live Valkey systemContext for AI:", ctxErr);
      }

      // 4. Generate AI Response using Context & Live Valkey Data
      const aiResponse = await aiService.generateChatResponse(message, history.messages, systemContext);
      
      // 5. Append AI response
      history.messages.push({ role: 'assistant', content: aiResponse, timestamp: Date.now() });
      
      // 6. Store updated history in Valkey (TTL 24 hours)
      await client.json.set(`chat_history:${sid}`, '$', history);
      await client.expire(`chat_history:${sid}`, 86400);
      
      res.status(200).json({ reply: aiResponse });
    } catch (error) {
      console.error('Error in AI Chat:', error);
      res.status(500).json({ error: 'AI Service Error' });
    }
  },

  // Semantic Vector Search endpoint
  semanticSearch: async (req, res) => {
    try {
      const { query } = req.body;
      
      // Check cache first (Semantic caching pattern)
      const cacheKey = `semantic_cache:${query.toLowerCase().replace(/ /g, '_')}`;
      const cachedResults = await client.json.get(cacheKey);
      
      if (cachedResults) {
        return res.status(200).json({ results: cachedResults, source: 'valkey_cache' });
      }
      
      // Perform Vector Search
      const results = await vectorSearchService.semanticSearch(query);
      
      // Cache results for 1 hour
      if (results.length > 0) {
        await client.json.set(cacheKey, '$', results);
        await client.expire(cacheKey, 3600);
      }
      
      res.status(200).json({ results, source: 'ai_engine' });
    } catch (error) {
      console.error('Error in Semantic Search:', error);
      res.status(500).json({ error: 'Search Engine Error' });
    }
  },

  // Smart Cart Insights endpoint
  cartInsights: async (req, res) => {
    try {
      const userId = req.user?.id || req.headers['x-session-id'] || 'guest';
      const cart = await client.json.get(`cart:${userId}`);
      
      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(200).json({ insights: [] });
      }
      
      // Hydrate cart items for AI
      const populatedItems = [];
      for (const item of cart.items) {
        const id = item.productId || item.id;
        const product = await client.json.get(`product:${id}`);
        if (product) {
          populatedItems.push(product);
        } else {
          populatedItems.push(item); // Fallback to basic cart item
        }
      }
      
      const insights = await aiService.analyzeCart(populatedItems);
      res.status(200).json({ insights });
    } catch (error) {
      console.error('Error in Cart Insights:', error);
      res.status(500).json({ error: 'AI Service Error' });
    }
  },

  // Review Summarizer endpoint
  summarizeReviews: async (req, res) => {
    try {
      const { productId } = req.body;
      const cacheKey = `ai_review_summary:${productId}`;
      
      // 1. Check Valkey AI Cache first (caching pattern)
      const cached = await client.json.get(cacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }
      
      // 2. Load actual customer reviews stored in Valkey JSON
      const reviews = await client.json.get(`reviews:${productId}`) || [];
      
      // 3. Perform comprehensive AI Analysis (Fake detection + sentiment)
      const analysis = await aiService.summarizeReviews(productId, reviews);
      
      // 4. Update review sentiment tracking metrics in Valkey Hash (sentiment tracking)
      if (analysis.sentimentAnalytics) {
        await client.hSet(`sentiment_tracking:${productId}`, {
          positiveCount: String(analysis.sentimentAnalytics.positiveCount || 0),
          negativeCount: String(analysis.sentimentAnalytics.negativeCount || 0),
          suspiciousCount: String(analysis.sentimentAnalytics.suspiciousCount || 0),
          verifiedCount: String(analysis.sentimentAnalytics.verifiedCount || 0)
        });
      }
      
      // 5. Update real-time Trust Score in Valkey Sorted Set (trust score ZSET)
      if (analysis.trustScore !== undefined) {
        await client.zAdd('product_trust_scores', { score: analysis.trustScore, value: productId });
      }
      
      // 6. Cache the AI analysis JSON in Valkey for 24 hours
      await client.json.set(cacheKey, '$', analysis);
      await client.expire(cacheKey, 86400);
      
      res.status(200).json(analysis);
    } catch (error) {
      console.error('Error in AI Review Summarizer:', error);
      res.status(500).json({ error: 'AI Service Error' });
    }
  }
};

router.post('/chat', aiController.chat);
router.post('/semantic-search', aiController.semanticSearch);
router.post('/summarize', aiController.summarizeReviews);
router.get('/cart-insights', aiController.cartInsights);

module.exports = router;
