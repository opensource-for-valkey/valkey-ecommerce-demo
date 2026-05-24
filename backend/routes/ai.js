const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../config/valkey');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Full product catalog with pricing history, stock, and combos
const PRODUCTS = [
  { id: 'prod-chromebook-001', name: 'HP Chromebook With Intel Celeron', price: 250, originalPrice: 349, category: 'electronics', stock: 45, tags: ['laptop', 'chromebook', 'hp', 'intel', 'computer'] },
  { id: 'prod-broccoli', name: 'Taylor Farms Broccoli Florets', price: 14.99, originalPrice: 14.99, category: 'grocery', stock: 200, tags: ['vegetables', 'organic', 'fresh', 'healthy', 'food'] },
  { id: 'prod-headphones', name: 'Premium Wireless Headphones', price: 89.99, originalPrice: 149.99, category: 'electronics', stock: 30, tags: ['audio', 'wireless', 'bluetooth', 'music', 'headphones'] },
  { id: 'prod-sneakers', name: 'Running Sneakers Pro', price: 129.99, originalPrice: 179.99, category: 'fashion', stock: 60, tags: ['shoes', 'running', 'sports', 'fitness', 'sneakers'] },
  { id: 'prod-watch', name: 'Smart Watch Series X', price: 299.99, originalPrice: 399.99, category: 'electronics', stock: 15, tags: ['watch', 'smart', 'fitness', 'wearable', 'tech'] },
  { id: 'prod-coffee', name: 'Organic Coffee Beans 1kg', price: 24.99, originalPrice: 29.99, category: 'grocery', stock: 150, tags: ['coffee', 'organic', 'beans', 'beverage', 'drink'] },
  { id: 'prod-backpack', name: 'Urban Travel Backpack', price: 59.99, originalPrice: 79.99, category: 'fashion', stock: 80, tags: ['bag', 'travel', 'backpack', 'urban', 'accessories'] },
  { id: 'prod-mouse', name: 'Ergonomic Wireless Mouse', price: 39.99, originalPrice: 54.99, category: 'electronics', stock: 100, tags: ['mouse', 'wireless', 'ergonomic', 'computer', 'office'] },
  { id: 'prod-yoga-mat', name: 'Premium Yoga Mat', price: 34.99, originalPrice: 44.99, category: 'fitness', stock: 70, tags: ['yoga', 'fitness', 'exercise', 'mat', 'wellness'] },
  { id: 'prod-protein', name: 'Whey Protein Powder 2kg', price: 49.99, originalPrice: 64.99, category: 'fitness', stock: 55, tags: ['protein', 'fitness', 'supplement', 'gym', 'health'] },
  { id: 'prod-tshirt', name: 'Cotton Crew Neck T-Shirt', price: 19.99, originalPrice: 24.99, category: 'fashion', stock: 300, tags: ['tshirt', 'cotton', 'casual', 'clothing', 'basic'] },
  { id: 'prod-charger', name: 'Fast Charging USB-C Cable', price: 12.99, originalPrice: 19.99, category: 'electronics', stock: 500, tags: ['charger', 'usb', 'cable', 'phone', 'accessories'] },
];

// Frequently bought together combos
const COMBOS = [
  { products: ['prod-chromebook-001', 'prod-mouse', 'prod-backpack'], name: 'Work From Anywhere Bundle', savings: '15%' },
  { products: ['prod-headphones', 'prod-charger'], name: 'Audio Essentials', savings: '10%' },
  { products: ['prod-sneakers', 'prod-yoga-mat', 'prod-protein'], name: 'Fitness Starter Pack', savings: '20%' },
  { products: ['prod-watch', 'prod-headphones', 'prod-charger'], name: 'Tech Lover Bundle', savings: '12%' },
  { products: ['prod-coffee', 'prod-broccoli'], name: 'Morning Wellness Kit', savings: '8%' },
  { products: ['prod-tshirt', 'prod-sneakers', 'prod-backpack'], name: 'Casual Day Out', savings: '18%' },
];

// Price history simulation
const PRICE_HISTORY = {
  'prod-chromebook-001': [{ date: '2 weeks ago', price: 299 }, { date: '1 week ago', price: 275 }, { date: 'Today', price: 250 }],
  'prod-headphones': [{ date: '1 month ago', price: 149.99 }, { date: '2 weeks ago', price: 119.99 }, { date: 'Today', price: 89.99 }],
  'prod-watch': [{ date: '1 month ago', price: 399.99 }, { date: 'Today', price: 299.99 }],
  'prod-sneakers': [{ date: '3 weeks ago', price: 179.99 }, { date: '1 week ago', price: 149.99 }, { date: 'Today', price: 129.99 }],
};

/**
 * Seed purchase analytics data in Valkey
 */
async function seedInsightsData(valkey) {
  const seeded = await valkey.get('insights:seeded');
  if (seeded) return;

  // Most purchased products (sorted set: product_id -> purchase_count)
  await valkey.zadd('insights:most_purchased',
    87, 'prod-chromebook-001',
    72, 'prod-headphones',
    65, 'prod-coffee',
    58, 'prod-tshirt',
    45, 'prod-sneakers',
    42, 'prod-mouse',
    38, 'prod-backpack',
    35, 'prod-charger',
    28, 'prod-watch',
    22, 'prod-broccoli',
    18, 'prod-yoga-mat',
    15, 'prod-protein'
  );

  // Combo purchase frequency
  await valkey.zadd('insights:popular_combos',
    34, 'Work From Anywhere Bundle',
    28, 'Fitness Starter Pack',
    25, 'Tech Lover Bundle',
    19, 'Audio Essentials',
    15, 'Casual Day Out',
    12, 'Morning Wellness Kit'
  );

  await valkey.set('insights:seeded', 'true');
}

/**
 * Smart AI response generator - acts as a friendly shopping buddy
 */
function generateResponse(msg, context) {
  const m = msg.toLowerCase().trim();

  // === GREETINGS ===
  if (m.match(/^(hi|hello|hey|sup|yo|good morning|good evening|howdy)/)) {
    return { text: "Hey there! 👋 I'm your personal shopping buddy. I can help you with:\n\n🛍️ Find products & deals\n📊 Price drop alerts\n📦 Track your orders\n🔥 What's trending\n💡 Smart recommendations\n🏷️ Bundle deals that save money\n\nWhat can I help you with today?", products: [], type: 'greeting' };
  }

  // === THANKS ===
  if (m.match(/(thank|thanks|thx|appreciate|awesome|great)/)) {
    return { text: "Glad I could help! 😊 I'm always here if you need product advice, want to track a deal, or just want to chat about what's new. Happy shopping! 🛍️", products: [], type: 'thanks' };
  }

  // === NAVIGATION HELP ===
  if (m.match(/(where|how do i|how to|navigate|find|go to|page)/)) {
    if (m.match(/(cart|basket)/)) return { text: "🛒 Your cart is accessible from the Cart icon in the top-right header. You can also go directly to /cart. From there you can adjust quantities, remove items, and proceed to checkout!", products: [], type: 'guide' };
    if (m.match(/(account|profile|dashboard|settings)/)) return { text: "👤 Head to your Account Dashboard by clicking your username in the header or going to /account. There you'll find:\n\n• Dashboard overview with order stats\n• Order history & tracking\n• Profile settings\n• Address management\n• Password change", products: [], type: 'guide' };
    if (m.match(/(checkout|pay|payment|buy)/)) return { text: "💳 To checkout:\n1. Add items to your cart\n2. Go to Cart → 'Proceed to Checkout'\n3. Fill in shipping details\n4. Choose payment method\n5. Click 'Place Order'\n\nYour order will appear in your Account → Orders tab!", products: [], type: 'guide' };
    if (m.match(/(shop|browse|products|catalog)/)) return { text: "🏪 Browse all products at /shop. You can:\n• Filter by category in the sidebar\n• Sort by price, popularity, or latest\n• Use the search bar in the header\n• Click any product for full details\n\nWant me to recommend something specific?", products: [], type: 'guide' };
    return { text: "🗺️ Here's a quick site guide:\n\n• **Home** → Featured products & deals\n• **Shop** → Full product catalog with filters\n• **Cart** → Your selected items\n• **Account** → Orders, profile, addresses\n• **Checkout** → Complete your purchase\n\nWhat are you looking for?", products: [], type: 'guide' };
  }

  // === ORDER HELP ===
  if (m.match(/(order|tracking|delivery|shipped|where is my|status|when will)/)) {
    return { text: "📦 Here's how to check your orders:\n\n1. Go to Account → Orders tab\n2. You'll see all orders with status (Processing/Shipped/Delivered)\n3. Click 'View' on any order for full details\n\n**Order statuses:**\n• 🟡 Processing — We're preparing your order\n• 🔵 Shipped — On its way to you\n• 🟢 Delivered — Enjoy your purchase!\n\nOrders over $100 get FREE shipping! 🚚", products: [], type: 'order' };
  }

  // === PRICE DROPS & DEALS ===
  if (m.match(/(price drop|deal|discount|sale|offer|cheap|save|reduced|price hike|price change|price history)/)) {
    const deals = PRODUCTS.filter(p => p.price < p.originalPrice).map(p => ({
      ...p, discount: Math.round((1 - p.price / p.originalPrice) * 100)
    })).sort((a, b) => b.discount - a.discount);

    const dealText = deals.slice(0, 4).map(d => `• ${d.name}: ~~$${d.originalPrice}~~ → **$${d.price}** (${d.discount}% OFF)`).join('\n');

    return { text: `🏷️ Current price drops & deals:\n\n${dealText}\n\n💡 Pro tip: Headphones dropped from $149.99 → $89.99 in the last month! Best time to buy.`, products: deals.slice(0, 4), type: 'deals' };
  }

  // === INVENTORY / STOCK ===
  if (m.match(/(stock|inventory|available|in stock|out of stock|how many|left|remaining)/)) {
    const lowStock = PRODUCTS.filter(p => p.stock < 30).sort((a, b) => a.stock - b.stock);
    const stockText = lowStock.map(p => `• ${p.name}: Only ${p.stock} left! ⚠️`).join('\n');
    const highStock = PRODUCTS.filter(p => p.stock >= 100);

    return { text: `📊 Inventory Status:\n\n**⚠️ Low Stock (grab these soon!):**\n${stockText}\n\n**✅ Well Stocked (${highStock.length} products):**\nPlenty available — no rush!\n\n💡 Items with low stock tend to sell out fast. Want me to help you grab something before it's gone?`, products: lowStock, type: 'inventory' };
  }

  // === BUNDLES / COMBOS ===
  if (m.match(/(bundle|combo|together|pair|combination|frequently bought|bought together)/)) {
    const comboText = COMBOS.map(c => {
      const items = c.products.map(id => PRODUCTS.find(p => p.id === id)?.name).filter(Boolean);
      return `🎁 **${c.name}** (Save ${c.savings})\n   ${items.join(' + ')}`;
    }).join('\n\n');

    return { text: `🛒 Popular bundles that customers love:\n\n${comboText}\n\n💡 Buying in bundles saves you money! Want details on any specific bundle?`, products: [], type: 'combos' };
  }

  // === MOST PURCHASED / BESTSELLERS ===
  if (m.match(/(most bought|most purchased|bestseller|best seller|popular|top selling|frequently|what do people buy)/)) {
    const top = [...PRODUCTS].sort((a, b) => a.stock - b.stock).slice(0, 4); // Lower stock = more purchased
    return { text: "🏆 Most frequently purchased products:\n\n1. HP Chromebook (87 sold this month)\n2. Premium Wireless Headphones (72 sold)\n3. Organic Coffee Beans (65 sold)\n4. Cotton Crew Neck T-Shirt (58 sold)\n\nThese are flying off the shelves! Want me to add any to your cart?", products: top, type: 'bestsellers' };
  }

  // === TRENDING ===
  if (m.match(/(trending|hot|what's new|new arrival|latest)/)) {
    const trending = PRODUCTS.filter(p => p.price < p.originalPrice).slice(0, 4);
    return { text: "🔥 Trending right now:\n\nThese products are seeing the most activity this week. Price drops + high demand = trending!", products: trending, type: 'trending' };
  }

  // === PRICE RANGE ===
  const priceMatch = m.match(/under\s*\$?(\d+)|below\s*\$?(\d+)|less than\s*\$?(\d+)|budget\s*\$?(\d+)|within\s*\$?(\d+)/);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4] || priceMatch[5]);
    const filtered = PRODUCTS.filter(p => p.price <= maxPrice).sort((a, b) => b.price - a.price);
    if (filtered.length > 0) {
      return { text: `💰 Products under $${maxPrice}:\n\nHere are your best options within budget:`, products: filtered.slice(0, 5), type: 'products' };
    }
    return { text: `Hmm, I don't have products under $${maxPrice} right now. Our most affordable item is the Fast Charging USB-C Cable at $12.99. Want me to show budget-friendly options?`, products: [], type: 'products' };
  }

  // === CATEGORY SEARCH ===
  const catMap = { electronics: 'electronics', tech: 'electronics', gadget: 'electronics', grocery: 'grocery', food: 'grocery', fashion: 'fashion', clothing: 'fashion', clothes: 'fashion', fitness: 'fitness', gym: 'fitness', workout: 'fitness', exercise: 'fitness' };
  for (const [keyword, cat] of Object.entries(catMap)) {
    if (m.includes(keyword)) {
      const filtered = PRODUCTS.filter(p => p.category === cat);
      return { text: `Here are our ${cat} products:`, products: filtered, type: 'products' };
    }
  }

  // === SPECIFIC PRODUCT SEARCH ===
  const matchedProducts = PRODUCTS.filter(p =>
    p.tags.some(tag => m.includes(tag)) || p.name.toLowerCase().split(' ').some(word => word.length > 3 && m.includes(word))
  );
  if (matchedProducts.length > 0) {
    return { text: "Found these for you! 🎯", products: matchedProducts.slice(0, 4), type: 'products' };
  }

  // === GIFT ===
  if (m.match(/(gift|present|surprise|birthday|anniversary)/)) {
    const gifts = PRODUCTS.filter(p => p.price > 50 && p.price < 200);
    return { text: "🎁 Great gift ideas in the sweet spot ($50-$200):\n\nThese are customer favorites for gifting!", products: gifts, type: 'products' };
  }

  // === COMPARE ===
  if (m.match(/(compare|vs|versus|difference|which is better)/)) {
    return { text: "🔍 I can help you compare! Tell me which products you're deciding between, or ask me things like:\n\n• \"Headphones vs Watch — which is a better deal?\"\n• \"Best electronics under $100?\"\n• \"What's the best value in fashion?\"\n\nI'll factor in price drops, stock levels, and popularity!", products: [], type: 'compare' };
  }

  // === RETURN / REFUND ===
  if (m.match(/(return|refund|exchange|cancel|wrong item)/)) {
    return { text: "↩️ Returns & Refunds:\n\n• 30-day return policy on all items\n• Items must be unused and in original packaging\n• Refunds processed within 5-7 business days\n• For exchanges, contact support\n\nTo initiate a return, go to Account → Orders → select the order → Request Return.\n\nNeed help with a specific order?", products: [], type: 'support' };
  }

  // === SHIPPING ===
  if (m.match(/(shipping|delivery time|how long|free shipping|shipping cost)/)) {
    return { text: "🚚 Shipping Info:\n\n• **Free shipping** on orders over $100\n• Standard delivery: 3-5 business days\n• Express delivery: 1-2 business days (+$10)\n• Same-day delivery available in select areas\n\n💡 Tip: Add items to reach $100 for free shipping! Want me to suggest items to top up your cart?", products: [], type: 'support' };
  }

  // === HELP / WHAT CAN YOU DO ===
  if (m.match(/(help|what can you|what do you|features|capabilities|guide me)/)) {
    return { text: "🤖 I'm your complete shopping buddy! Here's everything I can do:\n\n🛍️ **Product Discovery**\n• Search by category, price, or keywords\n• Smart recommendations based on trends\n\n📊 **Price Intelligence**\n• Price drop alerts & history\n• Best time to buy insights\n\n📦 **Order Support**\n• Track orders & delivery status\n• Return & refund guidance\n\n🏷️ **Smart Deals**\n• Bundle recommendations (save up to 20%)\n• Frequently bought together combos\n\n📈 **Inventory Alerts**\n• Low stock warnings\n• Restock notifications\n\n🗺️ **Site Navigation**\n• Guide you to any page\n• Explain features & how-tos\n\nJust ask me anything!", products: [], type: 'help' };
  }

  // === FALLBACK ===
  return { text: "I'm not sure I understood that, but I'm here to help! 😊 Try asking me:\n\n• \"What's on sale today?\"\n• \"Show me electronics under $100\"\n• \"What do people buy together?\"\n• \"Is the Smart Watch in stock?\"\n• \"How do I checkout?\"\n• \"What are the bestsellers?\"\n\nOr just say 'help' to see everything I can do!", products: [], type: 'fallback' };
}

/**
 * POST /api/ai/chat
 * Send a message to the AI chatbot
 */
router.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const valkey = getClient();
  const chatSession = sessionId || uuidv4();

  try {
    await seedInsightsData(valkey);
    const history = await valkey.lrange(`chat:${chatSession}`, 0, 19);
    const response = generateResponse(message, history);

    // Store conversation
    const userMsg = JSON.stringify({ role: 'user', content: message, timestamp: Date.now() });
    const botMsg = JSON.stringify({ role: 'assistant', content: response.text, products: response.products, timestamp: Date.now() });
    await valkey.rpush(`chat:${chatSession}`, userMsg, botMsg);
    await valkey.ltrim(`chat:${chatSession}`, -20, -1);
    await valkey.expire(`chat:${chatSession}`, 86400);

    // Track analytics
    await valkey.hincrby('insights:queries', message.toLowerCase().trim().substring(0, 50), 1);
    await valkey.hincrby('insights:intent_types', response.type, 1);
    await valkey.incr('insights:total_chats');

    res.json({ sessionId: chatSession, response: { text: response.text, products: response.products, type: response.type } });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed' });
  }
});

/**
 * GET /api/ai/insights
 * Get full purchase analytics and AI insights
 */
router.get('/insights', authenticate, async (req, res) => {
  const valkey = getClient();
  try {
    await seedInsightsData(valkey);

    const totalChats = await valkey.get('insights:total_chats') || '0';
    const intentTypes = await valkey.hgetall('insights:intent_types') || {};
    const topQueries = await valkey.hgetall('insights:queries') || {};
    const mostPurchased = await valkey.zrevrange('insights:most_purchased', 0, 9, 'WITHSCORES');
    const popularCombos = await valkey.zrevrange('insights:popular_combos', 0, 4, 'WITHSCORES');

    // Parse most purchased into readable format
    const topProducts = [];
    for (let i = 0; i < mostPurchased.length; i += 2) {
      const product = PRODUCTS.find(p => p.id === mostPurchased[i]);
      if (product) topProducts.push({ ...product, purchaseCount: parseInt(mostPurchased[i + 1]) });
    }

    // Parse combos
    const topCombos = [];
    for (let i = 0; i < popularCombos.length; i += 2) {
      const combo = COMBOS.find(c => c.name === popularCombos[i]);
      if (combo) topCombos.push({ ...combo, frequency: parseInt(popularCombos[i + 1]) });
    }

    // Sort queries
    const sortedQueries = Object.entries(topQueries)
      .map(([query, count]) => ({ query, count: parseInt(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Price insights
    const priceDrops = PRODUCTS.filter(p => p.price < p.originalPrice).map(p => ({
      name: p.name, currentPrice: p.price, originalPrice: p.originalPrice,
      discount: Math.round((1 - p.price / p.originalPrice) * 100)
    })).sort((a, b) => b.discount - a.discount);

    // Low stock alerts
    const lowStock = PRODUCTS.filter(p => p.stock < 30).sort((a, b) => a.stock - b.stock);

    // User's order count
    const username = req.user.username;
    const orderIds = await valkey.zrevrange(`orders:${username}`, 0, -1);

    res.json({
      insights: {
        totalChats: parseInt(totalChats),
        intentBreakdown: intentTypes,
        topQueries: sortedQueries,
        mostPurchasedProducts: topProducts,
        popularCombos: topCombos,
        priceDrops,
        lowStockAlerts: lowStock,
        totalOrders: orderIds.length,
        priceHistory: PRICE_HISTORY
      }
    });
  } catch (err) {
    console.error('Insights error:', err);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

/**
 * GET /api/ai/chat/history/:sessionId
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
