const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../config/valkey');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Product knowledge base (simulates AI product understanding)
const PRODUCTS = [
  { id: 'prod-chromebook-001', name: 'HP Chromebook With Intel Celeron', price: 250, category: 'electronics', tags: ['laptop', 'chromebook', 'hp', 'intel'] },
  { id: 'prod-broccoli', name: 'Taylor Farms Broccoli Florets', price: 14.99, category: 'grocery', tags: ['vegetables', 'organic', 'fresh', 'healthy'] },
  { id: 'prod-headphones', name: 'Premium Wireless Headphones', price: 89.99, category: 'electronics', tags: ['audio', 'wireless', 'bluetooth', 'music'] },
  { id: 'prod-sneakers', name: 'Running Sneakers Pro', price: 129.99, category: 'fashion', tags: ['shoes', 'running', 'sports', 'fitness'] },
  { id: 'prod-watch', name: 'Smart Watch Series X', price: 299.99, category: 'electronics', tags: ['watch', 'smart', 'fitness', 'wearable'] },
  { id: 'prod-coffee', name: 'Organic Coffee Beans 1kg', price: 24.99, category: 'grocery', tags: ['coffee', 'organic', 'beans', 'beverage'] },
  { id: 'prod-backpack', name: 'Urban Travel Backpack', price: 59.99, category: 'fashion', tags: ['bag', 'travel', 'backpack', 'urban'] },
  { id: 'prod-mouse', name: 'Ergonomic Wireless Mouse', price: 39.99, category: 'electronics', tags: ['mouse', 'wireless', 'ergonomic', 'computer'] },
];

// AI response patterns
const AI_RESPONSES = {
  greeting: [
    "Hey there! 👋 I'm your shopping assistant. I can help you find products, track orders, or give recommendations. What are you looking for?",
    "Hi! Welcome to Valkey Store. I can help you discover products, check deals, or answer questions. How can I help?",
  ],
  recommendation: "Based on your interests, I'd recommend checking out these products:",
  notFound: "I couldn't find exactly what you're looking for, but here are some popular items that might interest you:",
  orderHelp: "I can help with orders! You can view your order history in your Account Dashboard → Orders tab. Need anything else?",
  priceQuery: "Here are some options in your price range:",
  thanks: "You're welcome! Happy shopping! 🛍️ Let me know if you need anything else.",
  fallback: "I'm here to help with product recommendations, finding deals, and answering questions about our store. Try asking me things like:\n• \"Show me electronics under $100\"\n• \"What's trending today?\"\n• \"Recommend something for fitness\"\n• \"Help me find a gift\"",
};

/**
 * Analyze user message and generate intelligent response
 */
function generateResponse(message, userHistory) {
  const msg = message.toLowerCase().trim();

  // Greeting detection
  if (msg.match(/^(hi|hello|hey|sup|yo|good morning|good evening)/)) {
    return {
      text: AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)],
      products: [],
      type: 'greeting'
    };
  }

  // Thanks detection
  if (msg.match(/(thank|thanks|thx|appreciate)/)) {
    return { text: AI_RESPONSES.thanks, products: [], type: 'thanks' };
  }

  // Order help
  if (msg.match(/(order|tracking|delivery|shipped|where is my)/)) {
    return { text: AI_RESPONSES.orderHelp, products: [], type: 'order' };
  }

  // Price-based search
  const priceMatch = msg.match(/under\s*\$?(\d+)|below\s*\$?(\d+)|less than\s*\$?(\d+)|budget\s*\$?(\d+)/);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4]);
    const filtered = PRODUCTS.filter(p => p.price <= maxPrice);
    if (filtered.length > 0) {
      return { text: AI_RESPONSES.priceQuery, products: filtered.slice(0, 4), type: 'products' };
    }
  }

  // Category search
  const categories = ['electronics', 'grocery', 'fashion'];
  for (const cat of categories) {
    if (msg.includes(cat)) {
      const filtered = PRODUCTS.filter(p => p.category === cat);
      return { text: `Here are our ${cat} products:`, products: filtered, type: 'products' };
    }
  }

  // Tag/keyword search
  const matchedProducts = PRODUCTS.filter(p =>
    p.tags.some(tag => msg.includes(tag)) || p.name.toLowerCase().split(' ').some(word => msg.includes(word))
  );

  if (matchedProducts.length > 0) {
    return { text: AI_RESPONSES.recommendation, products: matchedProducts.slice(0, 4), type: 'products' };
  }

  // Trending/popular
  if (msg.match(/(trending|popular|best seller|hot|top|recommend)/)) {
    const shuffled = [...PRODUCTS].sort(() => Math.random() - 0.5);
    return { text: "🔥 Here's what's trending right now:", products: shuffled.slice(0, 4), type: 'products' };
  }

  // Gift suggestions
  if (msg.match(/(gift|present|surprise|birthday)/)) {
    const gifts = PRODUCTS.filter(p => p.price > 50);
    return { text: "🎁 Great gift ideas:", products: gifts.slice(0, 4), type: 'products' };
  }

  // Fitness/health
  if (msg.match(/(fitness|health|workout|exercise|gym|sport)/)) {
    const fitness = PRODUCTS.filter(p => p.tags.some(t => ['fitness', 'running', 'sports', 'healthy'].includes(t)));
    return { text: "💪 Here are some fitness & health picks:", products: fitness, type: 'products' };
  }

  // Fallback
  return { text: AI_RESPONSES.fallback, products: [], type: 'help' };
}

/**
 * POST /api/ai/chat
 * Send a message to the AI chatbot
 */
router.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const valkey = getClient();
  const chatSession = sessionId || uuidv4();

  try {
    // Get conversation history from Valkey
    const history = await valkey.lrange(`chat:${chatSession}`, 0, 19);

    // Generate AI response
    const response = generateResponse(message, history);

    // Store conversation in Valkey (keep last 20 messages)
    const userMsg = JSON.stringify({ role: 'user', content: message, timestamp: Date.now() });
    const botMsg = JSON.stringify({ role: 'assistant', content: response.text, products: response.products, timestamp: Date.now() });

    await valkey.rpush(`chat:${chatSession}`, userMsg, botMsg);
    await valkey.ltrim(`chat:${chatSession}`, -20, -1);
    await valkey.expire(`chat:${chatSession}`, 86400); // 24h TTL

    // Track query for insights
    await valkey.hincrby('insights:queries', message.toLowerCase().trim(), 1);
    await valkey.hincrby('insights:categories', response.type, 1);
    await valkey.incr('insights:total_chats');

    res.json({
      sessionId: chatSession,
      response: {
        text: response.text,
        products: response.products,
        type: response.type
      }
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed' });
  }
});

/**
 * GET /api/ai/insights
 * Get AI-powered analytics and insights
 */
router.get('/insights', authenticate, async (req, res) => {
  const valkey = getClient();

  try {
    const totalChats = await valkey.get('insights:total_chats') || '0';
    const categories = await valkey.hgetall('insights:categories') || {};
    const topQueries = await valkey.hgetall('insights:queries') || {};

    // Sort queries by count
    const sortedQueries = Object.entries(topQueries)
      .map(([query, count]) => ({ query, count: parseInt(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get user order stats
    const username = req.user.username;
    const orderIds = await valkey.zrevrange(`orders:${username}`, 0, -1);

    res.json({
      insights: {
        totalChats: parseInt(totalChats),
        categoryBreakdown: categories,
        topQueries: sortedQueries,
        totalOrders: orderIds.length,
        recommendations: PRODUCTS.sort(() => Math.random() - 0.5).slice(0, 3)
      }
    });
  } catch (err) {
    console.error('Insights error:', err);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

/**
 * GET /api/ai/chat/history/:sessionId
 * Get chat history for a session
 */
router.get('/chat/history/:sessionId', async (req, res) => {
  const valkey = getClient();
  try {
    const history = await valkey.lrange(`chat:${req.params.sessionId}`, 0, -1);
    const messages = history.map(msg => JSON.parse(msg));
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
