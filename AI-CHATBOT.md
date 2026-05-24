# 🤖 AI Shopping Buddy — Powered by Valkey

> **Team ZenCoders** | Agentic Search & AI-Powered Insights | Build Beyond Limits Hackathon

---

## 🎯 What It Does

A smart, friendly AI chatbot that lives in the bottom-right corner of every page. It acts as a **personal shopping assistant** — helping users find products, track prices, discover deals, navigate the store, and get personalized recommendations.

All conversation history and analytics are stored in **Valkey** for real-time performance.

---

## 💬 Chatbot Capabilities

| Feature | What It Does | Example Query |
|---------|-------------|---------------|
| 🛍️ Product Search | Find products by name, category, or keywords | "Show me electronics" |
| 💰 Price Filters | Search within a budget | "What's under $50?" |
| 🏷️ Price Drop Alerts | Shows current discounts with % off | "What's on sale?" |
| 📊 Bestsellers | Most frequently purchased products | "Show bestsellers" |
| 🎁 Bundle Deals | Frequently bought together combos | "Bundle deals" |
| 📦 Inventory Alerts | Low stock warnings | "What's running out?" |
| 🗺️ Site Navigation | Guides users to any page | "How do I checkout?" |
| 📦 Order Tracking | Explains order status & tracking | "Track my order" |
| 🚚 Shipping Info | Delivery times & free shipping rules | "Shipping info" |
| ↩️ Returns Help | Return policy & process | "How to return?" |
| 🎁 Gift Ideas | Curated suggestions for gifting | "Gift ideas" |
| 💪 Category Picks | Fitness, fashion, grocery, electronics | "Fitness products" |
| 🔥 Trending | What's hot right now | "What's trending?" |

---

## 📊 AI-Powered Insights (Backend Analytics)

The system tracks and analyzes user behavior to generate actionable insights:

### Most Purchased Products
```
1. HP Chromebook (87 sold this month)
2. Premium Wireless Headphones (72 sold)
3. Organic Coffee Beans (65 sold)
4. Cotton Crew Neck T-Shirt (58 sold)
5. Running Sneakers Pro (45 sold)
```

### Popular Product Combos (Frequently Bought Together)
```
🎁 Work From Anywhere Bundle (Save 15%)
   HP Chromebook + Wireless Mouse + Travel Backpack

💪 Fitness Starter Pack (Save 20%)
   Running Sneakers + Yoga Mat + Whey Protein

🎧 Tech Lover Bundle (Save 12%)
   Smart Watch + Headphones + USB-C Cable
```

### Price Intelligence
```
📉 Headphones: $149.99 → $89.99 (40% drop in 1 month)
📉 Smart Watch: $399.99 → $299.99 (25% drop)
📉 Chromebook: $349 → $250 (28% drop over 2 weeks)
```

### Low Stock Alerts
```
⚠️ Smart Watch Series X: Only 15 left
⚠️ Premium Wireless Headphones: Only 30 left
```

---

## 🏗️ How Valkey Is Used

| Valkey Structure | Key Pattern | Purpose |
|-----------------|-------------|---------|
| List | `chat:{sessionId}` | Conversation history (20 msgs, 24h TTL) |
| Sorted Set | `insights:most_purchased` | Product purchase rankings |
| Sorted Set | `insights:popular_combos` | Bundle frequency rankings |
| Hash | `insights:intent_types` | What users ask about (greeting, deals, orders...) |
| Hash | `insights:queries` | Search query frequency tracking |
| String | `insights:total_chats` | Total chat interactions counter |

### Why Valkey?
- **Lists with TTL** — Conversations auto-expire after 24h, no cleanup needed
- **Sorted Sets** — O(log N) ranking for bestsellers and combos
- **HINCRBY** — Atomic increment for real-time analytics without race conditions
- **LTRIM** — Keep only last 20 messages per session (memory efficient)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Send message, get AI response |
| GET | `/api/ai/insights` | Get full analytics dashboard (auth required) |
| GET | `/api/ai/chat/history/:sessionId` | Retrieve conversation history |

### Example Request
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the bestsellers?", "sessionId": "optional-session-id"}'
```

### Example Response
```json
{
  "sessionId": "uuid-session-id",
  "response": {
    "text": "🏆 Most frequently purchased products...",
    "products": [
      { "id": "prod-chromebook-001", "name": "HP Chromebook", "price": 250, "stock": 45 }
    ],
    "type": "bestsellers"
  }
}
```

---

## 🎨 Frontend Features

- **Floating chat button** — Bottom-right with pulse animation
- **Slide-up chat window** — Clean dark header, message bubbles
- **Quick action buttons** — One-tap common queries
- **Product cards in chat** — Clickable product recommendations with price
- **Typing indicator** — Animated dots while "thinking"
- **Session persistence** — Conversations maintained across page navigation
- **Responsive** — Works on mobile and desktop

---

## 🚀 How to Test

1. Start Valkey: `docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:9-alpine`
2. Start backend: `cd backend && npm start`
3. Start frontend: `cd frontend && npm start`
4. Click the orange chat button (bottom-right)
5. Try these queries:
   - "What's on sale?"
   - "Show me electronics under $100"
   - "What do people buy together?"
   - "Is the Smart Watch in stock?"
   - "How do I checkout?"
   - "Bundle deals"

---

## 👥 Team ZenCoders

| Member | Role |
|--------|------|
| Nooka Nikshith | Full-Stack Developer & Team Lead |
| Namburi Rishika | Frontend Developer |
| Pacha Likhitha Sai | Backend Developer |
| Rajkamal Pathgani | Database & DevOps |

**University:** Malla Reddy University
**GitHub:** [@nikki-nooka](https://github.com/nikki-nooka)

---

## 📜 License

MIT — Built for the Build Beyond Limits Hackathon powered by Valkey.
