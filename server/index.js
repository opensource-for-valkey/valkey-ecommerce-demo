import express from "express";
import cors from "cors";
import "dotenv/config";
import Redis from "ioredis";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 5005;
const CACHE_TTL_SECONDS = 60 * 60; // 1 hour

app.use(cors());
app.use(express.json());

// Initialize ioredis
const redis = new Redis({
  host: process.env.VALKEY_HOST || "127.0.0.1",
  port: Number(process.env.VALKEY_PORT) || 6379,
});

redis.on("connect", () => {
  console.log("\n=============================================");
  console.log(`✅ Connected to Valkey (127.0.0.1:${process.env.VALKEY_PORT || 6379})`);
  console.log("=============================================\n");
});

redis.on("error", (error) => {
  console.error("\n❌ Valkey Error:", error.message);
});

// Expanded mock database products for high-fidelity e-commerce search
const products = [
  // Laptops
  {
    id: 1,
    name: "ASUS ROG Zephyrus G14 Gaming Laptop",
    category: "laptop",
    price: 95000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 142,
    tags: ["gaming", "laptop", "performance", "asus", "rog", "zephyrus", "fast", "coding"],
  },
  {
    id: 2,
    name: "Apple MacBook Air M3",
    category: "laptop",
    price: 114900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: 320,
    tags: ["macbook", "laptop", "apple", "thin", "m3", "college", "office", "coding"],
  },
  {
    id: 3,
    name: "Lenovo IdeaPad Slim 3",
    category: "laptop",
    price: 42000,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200&auto=format&fit=crop&q=60",
    rating: 4.3,
    reviews: 88,
    tags: ["budget", "laptop", "student", "lenovo", "ideapad", "study", "coding"],
  },
  // Shoes
  {
    id: 4,
    name: "Nike Air Zoom Pegasus 40",
    category: "shoes",
    price: 11500,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: 215,
    tags: ["nike", "running", "shoes", "fitness", "sneakers", "sports", "pegasus"],
  },
  {
    id: 5,
    name: "Adidas Ultraboost Light",
    category: "shoes",
    price: 18000,
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=200&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 412,
    tags: ["adidas", "ultraboost", "running", "shoes", "comfort", "sneakers"],
  },
  {
    id: 6,
    name: "Puma Velocity Nitro 2",
    category: "shoes",
    price: 3500,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviews: 95,
    tags: ["puma", "velocity", "running", "shoes", "budget", "sneakers", "sports"],
  },
  // Smart Watches
  {
    id: 7,
    name: "Apple Watch Series 9 GPS",
    category: "watch",
    price: 41900,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 180,
    tags: ["apple", "watch", "smart", "fitness", "gps", "wearable", "series9"],
  },
  {
    id: 8,
    name: "Samsung Galaxy Watch 6",
    category: "watch",
    price: 29999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: 154,
    tags: ["samsung", "watch", "smart", "galaxy", "wearable", "android"],
  },
  {
    id: 9,
    name: "Noise ColorFit Pro 5",
    category: "watch",
    price: 3999,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200&auto=format&fit=crop&q=60",
    rating: 4.2,
    reviews: 512,
    tags: ["noise", "colorfit", "smart", "watch", "budget", "wearable"],
  },
  // Accessories & Gear
  {
    id: 10,
    name: "Logitech G502 Hero Gaming Mouse",
    category: "accessories",
    price: 4500,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: 1205,
    tags: ["logitech", "gaming", "mouse", "g502", "hero", "wired", "accessories"],
  },
  {
    id: 11,
    name: "Razer DeathAdder V3 Pro",
    category: "accessories",
    price: 13999,
    image: "https://images.unsplash.com/photo-1625842268584-8f3290404d41?w=200&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 210,
    tags: ["razer", "gaming", "mouse", "deathadder", "wireless", "pro"],
  },
  // Toys, Science Kits & Gift items
  {
    id: 12,
    name: "National Geographic Dual Microscope Science Kit",
    category: "toys",
    price: 4500,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 156,
    tags: ["toys", "gifts", "science", "microscope", "kit", "nephew", "education", "stem", "kid", "physics", "biology"],
  },
  {
    id: 13,
    name: "STEM Chemistry Science Experiment Lab Kit",
    category: "toys",
    price: 2499,
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=200&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: 84,
    tags: ["chemistry", "toys", "science", "experiment", "education", "stem", "gift", "nephew", "kid", "labs"],
  },
  {
    id: 14,
    name: "LEGO NASA Space Shuttle Discovery Model Kit",
    category: "toys",
    price: 15999,
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: 512,
    tags: ["lego", "toys", "nasa", "space", "shuttle", "building", "science", "gift", "nephew", "kid"],
  },
  {
    id: 15,
    name: "Celestron Astromaster Refractor Telescope",
    category: "gear",
    price: 9999,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: 320,
    tags: ["telescope", "space", "astronomy", "science", "gift", "gear", "nephew", "astromaster"],
  },
  {
    id: 16,
    name: "Kindle Paperwhite (16 GB) E-reader",
    category: "gear",
    price: 13999,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 950,
    tags: ["kindle", "ereader", "books", "paperwhite", "gift", "gear", "reading"],
  },
  // Audio
  {
    id: 17,
    name: "Sony WH-1000XM5 ANC Headphones",
    category: "audio",
    price: 29990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: 840,
    tags: ["sony", "wh1000xm5", "audio", "headphones", "anc", "noise", "cancelling", "wireless"],
  },
  {
    id: 18,
    name: "Bose QuietComfort Ultra",
    category: "audio",
    price: 35900,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 312,
    tags: ["bose", "quietcomfort", "ultra", "audio", "headphones", "anc", "wireless"],
  },
  {
    id: 19,
    name: "OnePlus Buds Pro 2",
    category: "audio",
    price: 9999,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviews: 188,
    tags: ["oneplus", "buds", "pro", "earphone", "wireless", "audio", "anc"],
  }
];

// Initialize modern Gemini API if key is provided
let ai = null;
if (process.env.GEMINI_API_KEY) {
  console.log("🤖 Gemini API Key found. Modern Google Gen AI SDK Activated!");
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
} else {
  console.log("ℹ️ No Gemini API Key found. Running with local Regex-based AI Mock Parser.");
}

/**
 * Resilient Local NLP Fallback Parser
 * Mimics complex AI parsing of price limits, categories, and keywords using regular expressions.
 */
function parseQueryLocalFallback(query) {
  const normalized = query.toLowerCase().trim();
  let maxPrice = null;
  let category = null;
  let searchTerm = "";

  // 1. Extract price filter (e.g. "under 5000", "below 10000", "less than 2000")
  const underPriceMatch = normalized.match(/(?:under|below|less\s+than|budget)\s*(\d+)/i);
  if (underPriceMatch) {
    maxPrice = parseInt(underPriceMatch[1], 10);
  }

  // 2. Extract category filters
  if (normalized.includes("laptop")) {
    category = "laptop";
  } else if (normalized.includes("shoe") || normalized.includes("sneaker")) {
    category = "shoes";
  } else if (normalized.includes("watch")) {
    category = "watch";
  } else if (normalized.includes("mouse") || normalized.includes("accessory") || normalized.includes("accessories")) {
    category = "accessories";
  } else if (normalized.includes("headphone") || normalized.includes("audio") || normalized.includes("earphone") || normalized.includes("sound")) {
    category = "audio";
  } else if (normalized.includes("toy") || normalized.includes("gift") || normalized.includes("science") || normalized.includes("nephew") || normalized.includes("kid")) {
    // Treat gift/science queries as toys/gear
    if (normalized.includes("telescope")) {
      category = "gear";
    } else {
      category = "toys";
    }
  }

  // 3. Extract core descriptive search terms (adjectives + nouns)
  const keywords = [];
  
  // Look for descriptive words from our product properties/tags
  if (normalized.includes("gaming")) keywords.push("gaming");
  if (normalized.includes("running")) keywords.push("running");
  if (normalized.includes("smart")) keywords.push("smart");
  if (normalized.includes("wireless")) keywords.push("wireless");
  if (normalized.includes("science") || normalized.includes("nephew") || normalized.includes("chemistry") || normalized.includes("microscope")) {
    keywords.push("science");
  }
  
  // Add the category word if it was found
  if (category) {
    keywords.push(category === "shoes" ? "shoes" : category);
  } else {
    // If no category was identified, fall back to removing common conversational stop words
    const stopWords = /\b(suggest|recommend|show|me|want|need|looking|for|buy|a|an|the|some|and|to|for|with|my|please|is|are|of|in|at)\b/gi;
    const cleaned = normalized
      .replace(stopWords, "")
      .replace(/(?:under|below|less\s+than|budget)\s*\d+/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    if (cleaned) {
      keywords.push(cleaned);
    }
  }

  searchTerm = keywords.join(" ").trim();
  if (!searchTerm) {
    searchTerm = query;
  }

  return {
    searchTerm,
    maxPrice,
    category,
    aiExplanation: `Local AI Agent parsed intent: searching for "${searchTerm}"${category ? ` in category "${category}"` : ""}${maxPrice ? ` under ${maxPrice} INR` : ""}.`
  };
}

/**
 * AI Query Parsing via Gemini with Multi-Turn Conversation Memory support
 */
async function parseQueryWithAI(query, history = []) {
  if (!ai) {
    return parseQueryLocalFallback(query);
  }

  try {
    const contents = [];

    // 1. Reconstruct chat history in Gemini v2 SDK layout
    if (history && history.length > 0) {
      for (const turn of history) {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.text }]
        });
      }
    }

    // 2. Push user prompt containing instructions
    contents.push({
      role: 'user',
      parts: [{ text: `
        Analyze this new search query: "${query}" in the context of the preceding search history.
        
        RULES:
        - If the new query is a conversational follow-up constraint (e.g. "show me cheaper ones", "under 50000", "only Puma ones"), MERGE this constraint with the previous active product focus.
        - If the new query represents a complete topic shift (e.g. searching "macbook" after "running shoes" or asking for a "science kit gift for my nephew"), DISCARD the previous context entirely and parse the new query from scratch.
        - The "category" filter MUST be one of: "laptop", "shoes", "watch", "accessories", "audio", "toys", "gear". Choose the one that fits best (e.g. Telescopes are "gear", chemistry kits are "toys").
        - The "aiExplanation" should mention if it refined the search (e.g., "Refined search to gaming laptops under 50,000 INR") or parsed it brand new.
        
        Extract the following structured filters in JSON format:
        {
          "searchTerm": "a simplified keyword search term representing the core product focus (string)",
          "maxPrice": null or number if the user specifies a maximum price limit,
          "category": "laptop", "shoes", "watch", "accessories", "audio", "toys", "gear", or null if not specified,
          "aiExplanation": "A short, professional 1-sentence explanation of what the user is looking for and how it refines the previous search (if applicable)."
        }
      ` }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("⚠️ Gemini 3 API Error, falling back to local parsing:", error.message);
    return parseQueryLocalFallback(query);
  }
}

/**
 * Filter products based on parsed intent
 */
const searchProductsWithIntent = (parsed) => {
  const { searchTerm, category, maxPrice } = parsed;
  const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    // 1. Category filter
    if (category && product.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // 2. Price filter
    if (maxPrice && product.price > maxPrice) {
      return false;
    }

    // 3. Keyword matching (only if terms exist)
    if (terms.length > 0) {
      const searchableText = [
        product.name,
        product.category,
        ...(product.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return terms.every((term) => searchableText.includes(term));
    }

    return true;
  });
};

const normalizeQuery = (query) => query.trim().toLowerCase();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POST /agent-search
 * Core endpoint for Agentic Search. Implements dual-tiered caching and Conversational memory.
 */
app.post("/agent-search", async (req, res) => {
  const start = Date.now();
  const rawQuery = req.body.query || "";
  const sessionId = req.body.sessionId || null;
  const normalizedQuery = normalizeQuery(rawQuery);

  if (!normalizedQuery) {
    return res.status(400).json({
      source: "validation",
      data: [],
      responseTime: `${Date.now() - start}ms`,
      error: "query is required",
    });
  }

  console.log(`\n🔍 [INCOMING SEARCH] Query: "${rawQuery}" (Session: ${sessionId || 'None'})`);

  const trendKey = `trend:${normalizedQuery}`;
  await redis.incr(trendKey);

  // Load conversational session history from Valkey in 1ms
  let historyKey = sessionId ? `history:${sessionId}` : null;
  let history = [];
  if (historyKey) {
    const cachedHistory = await redis.get(historyKey);
    if (cachedHistory) {
      history = JSON.parse(cachedHistory);
      console.log(`🧠 [VALKEY SESSION] Loaded session history containing ${history.length} turns.`);
    }
  }

  // Segment cache key by session to keep conversation context cached correctly
  const cacheKey = `search:${sessionId ? sessionId + ':' : ''}${normalizedQuery}`;
  const aiCacheKey = `ai:${sessionId ? sessionId + ':' : ''}${normalizedQuery}`;

  const cachedResults = await redis.get(cacheKey);

  if (cachedResults) {
    let parsedIntent = null;
    const cachedAI = await redis.get(aiCacheKey);
    if (cachedAI) {
      parsedIntent = JSON.parse(cachedAI);
      console.log(`⚡ [AI CACHE] HIT: parsed intent loaded from Valkey.`);
    } else {
      parsedIntent = await parseQueryWithAI(normalizedQuery, history);
      await redis.set(aiCacheKey, JSON.stringify(parsedIntent), "EX", CACHE_TTL_SECONDS);
    }

    // Save this search turn in session history
    let currentHistory = [];
    if (historyKey) {
      const updatedHistory = [
        ...history,
        { role: "user", text: rawQuery },
        { role: "model", text: parsedIntent.aiExplanation }
      ];
      // Store last 3 turns (6 messages) to avoid database bloat, valid for 15 mins
      await redis.set(historyKey, JSON.stringify(updatedHistory.slice(-6)), "EX", 900);
      currentHistory = updatedHistory;
    }

    const responseTime = `${Date.now() - start}ms`;
    console.log(`⚡ [SEARCH CACHE] HIT`);
    console.log(`Response Time: ${responseTime}\n`);

    return res.json({
      source: "valkey-cache",
      data: JSON.parse(cachedResults),
      aiIntent: parsedIntent,
      history: currentHistory,
      responseTime,
    });
  }

  // Search Cache Miss
  console.log(`❌ [SEARCH CACHE] MISS`);
  await sleep(180);

  // Parse query using history context
  const parsedIntent = await parseQueryWithAI(normalizedQuery, history);
  await redis.set(aiCacheKey, JSON.stringify(parsedIntent), "EX", CACHE_TTL_SECONDS);

  // Filter products using the parsed intent
  const results = searchProductsWithIntent(parsedIntent);

  // Store filtered results in Valkey product search cache
  await redis.set(cacheKey, JSON.stringify(results), "EX", CACHE_TTL_SECONDS);

  // Update session history in Valkey
  let currentHistory = [];
  if (historyKey) {
    const updatedHistory = [
      ...history,
      { role: "user", text: rawQuery },
      { role: "model", text: parsedIntent.aiExplanation }
    ];
    await redis.set(historyKey, JSON.stringify(updatedHistory.slice(-6)), "EX", 900);
    currentHistory = updatedHistory;
  }

  const responseTime = `${Date.now() - start}ms`;
  console.log(`Response Time: ${responseTime}\n`);

  res.json({
    source: "database",
    data: results,
    aiIntent: parsedIntent,
    history: currentHistory,
    responseTime,
  });
});

/**
 * GET /trending
 * Retrieves top 5 trending search terms
 */
app.get("/trending", async (req, res) => {
  try {
    const keys = await redis.keys("trend:*");
    const counts = keys.length ? await redis.mget(keys) : [];
    
    const trends = keys.map((key, index) => ({
      query: key.replace("trend:", ""),
      count: Number(counts[index]),
    }));

    // Sort descending
    trends.sort((a, b) => b.count - a.count);

    // Return top 5
    res.json(trends.slice(0, 5));
  } catch (error) {
    console.error("⚠️ Trending fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch trending searches" });
  }
});

/**
 * POST /clear-session
 * Clears the session history key in Valkey
 */
app.post("/clear-session", async (req, res) => {
  const sessionId = req.body.sessionId;
  if (sessionId) {
    await redis.del(`history:${sessionId}`);
    await redis.keys(`search:${sessionId}:*`).then(async (keys) => {
      if (keys.length) await redis.del(keys);
    });
    await redis.keys(`ai:${sessionId}:*`).then(async (keys) => {
      if (keys.length) await redis.del(keys);
    });
    console.log(`🗑️ [VALKEY SESSION] Cleared session history & caches for session: ${sessionId}`);
  }
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Express Backend Server running on port ${PORT}`);
});
