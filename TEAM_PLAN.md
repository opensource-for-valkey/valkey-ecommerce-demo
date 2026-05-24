# VoiceCart AI — Team Plan & Developer Guide

> Voice-controlled shopping assistant powered by Google ADK (Gemini) + Valkey

---

## Project Overview

Users interact **entirely through voice**. They speak naturally — search products, add to cart, place orders — all without touching the UI. The AI agent handles everything, backed by Valkey for all data storage.

```
User Speaks → Google ADK Agent → Valkey → Spoken Response + Live UI Update
```

---

## Team Assignments

| Member | Role | Owns |
|--------|------|------|
| **Member 1** | Foundation | Valkey setup, seed data, search index, FastAPI server, orchestrator |
| **Member 2** | Search & Discovery | search_agent, discovery_agent, all search tools |
| **Member 3** | Cart & Orders | cart_agent, order_agent, all cart and checkout tools |
| **Member 4** | Frontend & Voice UI | All React components, voice input, speech output, product cards |

---

## Timeline Overview

```
TIME ──────────────────────────────────────────────────────────────►

Member 1  │███████████ FOUNDATION ████████████│
          │                                   │
Member 2  │ ██ STUBS + DESIGN ████│           │████ REAL VALKEY IMPL ████│
          │                       │           │
Member 3  │ ██ STUBS + DESIGN ████│           │████ REAL VALKEY IMPL ████│
          │                       │           │
Member 4  │ ████████████████ FULL FRONTEND (independent) ████████████████│
          │                                   │
          ▼                                   ▼
        START                         FOUNDATION READY
                                    (Members 2,3 swap stubs → real)
```

**Key insight:**
- Member 4 works fully independently — frontend never needs the backend running
- Members 2 & 3 write stub tools first (fake data), swap to real Valkey once foundation is ready
- No one sits idle

---

## Project Structure

```
voicecart/
├── backend/
│   ├── main.py                  ← Member 1
│   ├── config.py                ← Member 1
│   ├── valkey_client.py         ← Member 1
│   ├── seed_data.py             ← Member 1
│   ├── orchestrator.py          ← Member 1 (skeleton) → all fill in
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── search_agent.py      ← Member 2
│   │   ├── discovery_agent.py   ← Member 2
│   │   ├── cart_agent.py        ← Member 3
│   │   └── order_agent.py       ← Member 3
│   │
│   └── tools/
│       ├── __init__.py
│       ├── search_tools.py      ← Member 2
│       ├── discovery_tools.py   ← Member 2
│       ├── cart_tools.py        ← Member 3
│       └── order_tools.py       ← Member 3
│
├── frontend/                    ← Member 4 ONLY
│   └── src/
│       ├── components/
│       │   ├── VoiceButton.jsx
│       │   ├── VoiceChat.jsx
│       │   ├── ProductCard.jsx
│       │   └── CartDrawer.jsx
│       ├── hooks/
│       │   └── useVoice.js
│       └── ...
│
├── .env
├── requirements.txt
└── docker-compose.yml
```

---

---

# MEMBER 1 — Foundation

**Everyone waits for this to finish. Estimated time: 2–3 hours.**

When done, Member 1 announces: "Foundation ready, pull and start."

---

### Step 1: Folder structure

```bash
mkdir voicecart && cd voicecart
mkdir -p backend/agents backend/tools frontend
touch backend/__init__.py backend/agents/__init__.py backend/tools/__init__.py
```

### Step 2: requirements.txt

```
fastapi
uvicorn
google-adk
redis
python-dotenv
sentence-transformers
```

```bash
pip install -r requirements.txt
```

### Step 3: Start Valkey with Docker

```bash
docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:9-alpine
```

Verify:
```bash
docker exec -it valkey valkey-cli ping
# Expected: PONG
```

### Step 4: .env

```bash
GOOGLE_API_KEY=your_key_from_aistudio.google.com
VALKEY_HOST=localhost
VALKEY_PORT=6379
APP_NAME=voicecart
SESSION_TTL=86400
CART_TTL=604800
```

### Step 5: config.py

```python
# backend/config.py
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
VALKEY_HOST = os.getenv("VALKEY_HOST", "localhost")
VALKEY_PORT = int(os.getenv("VALKEY_PORT", 6379))
APP_NAME = os.getenv("APP_NAME", "voicecart")
SESSION_TTL = int(os.getenv("SESSION_TTL", 86400))
CART_TTL = int(os.getenv("CART_TTL", 604800))
```

### Step 6: valkey_client.py

```python
# backend/valkey_client.py
import redis
from config import VALKEY_HOST, VALKEY_PORT

r = redis.Redis(host=VALKEY_HOST, port=VALKEY_PORT, decode_responses=True)

def ping():
    return r.ping()

def get_client():
    return r
```

### Step 7: seed_data.py

```python
# backend/seed_data.py
import json
from valkey_client import r

PRODUCTS = [
    {
        "id": "product:01-samsung-a54",
        "name": "Samsung Galaxy A54",
        "brand": "Samsung",
        "category": "smartphones",
        "price": 38999,
        "description": "6.4 inch AMOLED display, 50MP camera, 5000mAh battery",
        "rating": 4.5,
        "stock": 50,
        "image": "/assets/products/samsung-a54.jpg"
    },
    {
        "id": "product:02-iphone-15",
        "name": "Apple iPhone 15",
        "brand": "Apple",
        "category": "smartphones",
        "price": 79999,
        "description": "6.1 inch Super Retina XDR, A16 Bionic chip, 48MP camera",
        "rating": 4.8,
        "stock": 30,
        "image": "/assets/products/iphone-15.jpg"
    },
    {
        "id": "product:03-sony-wh1000",
        "name": "Sony WH-1000XM5",
        "brand": "Sony",
        "category": "headphones",
        "price": 29999,
        "description": "Industry leading noise cancellation, 30hr battery",
        "rating": 4.7,
        "stock": 40,
        "image": "/assets/products/sony-wh1000.jpg"
    },
    {
        "id": "product:04-nike-airmax",
        "name": "Nike Air Max 270",
        "brand": "Nike",
        "category": "shoes",
        "price": 12999,
        "description": "Max Air cushioning, breathable mesh upper",
        "rating": 4.4,
        "stock": 60,
        "image": "/assets/products/nike-airmax.jpg"
    },
    {
        "id": "product:05-samsung-tv",
        "name": "Samsung 55 inch 4K TV",
        "brand": "Samsung",
        "category": "televisions",
        "price": 54999,
        "description": "Crystal 4K, HDR, built-in Alexa, 3 HDMI ports",
        "rating": 4.6,
        "stock": 20,
        "image": "/assets/products/samsung-tv.jpg"
    },
    {
        "id": "product:06-apple-airpods",
        "name": "Apple AirPods Pro 2",
        "brand": "Apple",
        "category": "headphones",
        "price": 24999,
        "description": "Active noise cancellation, transparency mode",
        "rating": 4.9,
        "stock": 45,
        "image": "/assets/products/airpods-pro.jpg"
    },
    {
        "id": "product:07-oneplus-12",
        "name": "OnePlus 12",
        "brand": "OnePlus",
        "category": "smartphones",
        "price": 64999,
        "description": "Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W charging",
        "rating": 4.6,
        "stock": 35,
        "image": "/assets/products/oneplus-12.jpg"
    },
    {
        "id": "product:08-lg-monitor",
        "name": "LG 27 inch 4K Monitor",
        "brand": "LG",
        "category": "monitors",
        "price": 32999,
        "description": "IPS panel, HDR400, USB-C, great for work and gaming",
        "rating": 4.5,
        "stock": 25,
        "image": "/assets/products/lg-monitor.jpg"
    }
]

COUPONS = [
    {
        "code": "SAVE10",
        "type": "percentage",
        "value": 10,
        "active": True,
        "min_order": 5000
    },
    {
        "code": "FLAT500",
        "type": "fixed",
        "value": 500,
        "active": True,
        "min_order": 2000
    }
]

def create_search_index():
    try:
        r.execute_command("FT.DROPINDEX", "idx:products", "DD")
    except:
        pass

    r.execute_command(
        "FT.CREATE", "idx:products",
        "ON", "JSON",
        "PREFIX", "1", "product:",
        "SCHEMA",
        "$.name",        "AS", "name",        "TEXT",    "WEIGHT", "5.0",
        "$.brand",       "AS", "brand",        "TAG",
        "$.category",    "AS", "category",     "TAG",
        "$.price",       "AS", "price",        "NUMERIC", "SORTABLE",
        "$.rating",      "AS", "rating",       "NUMERIC", "SORTABLE",
        "$.description", "AS", "description",  "TEXT",    "WEIGHT", "1.0",
    )
    print("Search index created.")

def seed_products():
    for product in PRODUCTS:
        r.execute_command("JSON.SET", product["id"], "$", json.dumps(product))
        r.sadd(f"brand:{product['brand'].lower()}", product["id"])
        r.sadd(f"category:{product['category']}", product["id"])
        r.zadd("price_index", {product["id"]: product["price"]})
        r.zadd("trending:global", {product["id"]: 0})
    print(f"Seeded {len(PRODUCTS)} products.")

def seed_coupons():
    for coupon in COUPONS:
        r.execute_command("JSON.SET", f"coupon:{coupon['code']}", "$", json.dumps(coupon))
    print(f"Seeded {len(COUPONS)} coupons.")

if __name__ == "__main__":
    create_search_index()
    seed_products()
    seed_coupons()
    print("Valkey is ready.")
```

Run once:
```bash
cd backend && python seed_data.py
```

### Step 8: orchestrator.py (skeleton)

```python
# backend/orchestrator.py
import os
from google.adk.agents import Agent
from config import GOOGLE_API_KEY

os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Members 2 and 3 uncomment their agents as they finish
# from agents.search_agent import search_agent
# from agents.discovery_agent import discovery_agent
# from agents.cart_agent import cart_agent
# from agents.order_agent import order_agent

orchestrator = Agent(
    name="orchestrator",
    model="gemini-2.0-flash",
    description="Root voice shopping assistant that routes user requests",
    instruction="""
        You are VoiceCart, a friendly voice shopping assistant.
        Route user requests to the correct specialist:
        - Product search, find, show, filter → search_agent
        - Add, remove, update, view cart     → cart_agent
        - Place order, checkout, buy now     → order_agent
        - Trending, recommended, history     → discovery_agent

        Rules:
        - ALL spoken responses must be under 2 sentences.
        - Always use ₹ for prices.
        - Confirm every cart action by name: "Added Sony headphones to your cart."
        - If unsure, ask one short clarifying question.
    """,
    sub_agents=[]  # Agents added here as each member finishes
)
```

### Step 9: main.py

```python
# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.types import Content, Part
from orchestrator import orchestrator
import uvicorn

app = FastAPI(title="VoiceCart AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

session_service = InMemorySessionService()
runner = Runner(
    agent=orchestrator,
    session_service=session_service,
    app_name="voicecart"
)

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    session_id: str

@app.get("/health")
def health():
    from valkey_client import ping
    return {"status": "ok", "valkey": ping()}

@app.post("/api/agent/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        await session_service.get_or_create_session(
            app_name="voicecart",
            user_id=req.session_id,
            session_id=req.session_id
        )
        content = Content(role="user", parts=[Part(text=req.message)])
        response_text = ""

        async for event in runner.run_async(
            user_id=req.session_id,
            session_id=req.session_id,
            new_message=content
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text

        return ChatResponse(response=response_text, session_id=req.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

### Step 10: Verify & announce

```bash
cd backend && python main.py
# Open: http://localhost:8000/health
# Must return: {"status": "ok", "valkey": true}
```

**Push to Git and tell the team: "Foundation ready, pull now."**

---

---

# MEMBER 2 — Search & Discovery Agent

## Phase A — While Member 1 is building (work on stubs now)

Write stub versions of all tools with fake data. This means you can write and test your agent logic immediately — no Valkey needed yet.

```python
# backend/tools/search_tools.py  ← STUB VERSION (Phase A)

def search_by_keyword(query: str) -> dict:
    """Search products by any keyword.

    Args:
        query: What the user is looking for e.g. 'wireless headphones'

    Returns:
        List of matching products with name, price, rating
    """
    # STUB — replace with real Valkey call in Phase B
    return {
        "products": [
            {"id": "product:03-sony-wh1000", "name": "Sony WH-1000XM5", "price": 29999, "rating": 4.7},
            {"id": "product:06-apple-airpods", "name": "Apple AirPods Pro 2", "price": 24999, "rating": 4.9},
        ],
        "count": 2
    }

def search_by_brand(brand: str) -> dict:
    """Search all products from a specific brand.

    Args:
        brand: Brand name e.g. 'Samsung', 'Apple', 'Sony'

    Returns:
        List of products from that brand
    """
    # STUB — replace in Phase B
    return {
        "products": [
            {"id": "product:01-samsung-a54", "name": "Samsung Galaxy A54", "price": 38999, "rating": 4.5},
        ],
        "count": 1
    }

def search_by_price_range(min_price: int, max_price: int) -> dict:
    """Search products within a price range.

    Args:
        min_price: Minimum price in rupees
        max_price: Maximum price in rupees

    Returns:
        Products within that price range sorted by price
    """
    # STUB — replace in Phase B
    return {"products": [], "count": 0}

def search_by_category(category: str) -> dict:
    """Search products by category.

    Args:
        category: e.g. 'smartphones', 'headphones', 'shoes', 'televisions'

    Returns:
        Products in that category
    """
    # STUB — replace in Phase B
    return {"products": [], "count": 0}

def get_product_details(product_id: str) -> dict:
    """Get full details of a specific product.

    Args:
        product_id: e.g. 'product:01-samsung-a54'

    Returns:
        Full product details
    """
    # STUB — replace in Phase B
    return {"id": product_id, "name": "Sample Product", "price": 9999, "rating": 4.5}

def get_top_rated_products() -> dict:
    """Get the highest rated products in the store.

    Returns:
        Top 5 products by customer rating
    """
    # STUB — replace in Phase B
    return {"products": [], "count": 0}
```

```python
# backend/tools/discovery_tools.py  ← STUB VERSION (Phase A)

def get_trending_products() -> dict:
    """Get the most trending products right now.

    Returns:
        Top 5 trending products
    """
    # STUB — replace in Phase B
    return {"products": [], "count": 0}

def track_product_view(session_id: str, product_id: str) -> dict:
    """Track that a user viewed a product.

    Args:
        session_id: Current user session
        product_id: Product that was viewed

    Returns:
        Confirmation
    """
    # STUB — replace in Phase B
    return {"status": "tracked"}

def get_recently_viewed(session_id: str) -> dict:
    """Get products the user recently viewed.

    Args:
        session_id: Current user session

    Returns:
        Last 5 viewed products
    """
    # STUB — replace in Phase B
    return {"products": [], "count": 0}
```

Write agents using these stubs:

```python
# backend/agents/search_agent.py
from google.adk.agents import Agent
from tools.search_tools import (
    search_by_keyword,
    search_by_brand,
    search_by_price_range,
    search_by_category,
    get_product_details,
    get_top_rated_products,
)

search_agent = Agent(
    name="search_agent",
    model="gemini-2.0-flash",
    description="Finds and shows products based on user queries",
    instruction="""
        You are a product search specialist.
        Find products matching the user request.
        Always mention: product name, price in ₹, and rating.
        Keep response under 3 sentences.
        If multiple results, list top 3 with prices.
    """,
    tools=[
        search_by_keyword,
        search_by_brand,
        search_by_price_range,
        search_by_category,
        get_product_details,
        get_top_rated_products,
    ]
)
```

```python
# backend/agents/discovery_agent.py
from google.adk.agents import Agent
from tools.discovery_tools import (
    get_trending_products,
    get_recently_viewed,
    track_product_view,
)

discovery_agent = Agent(
    name="discovery_agent",
    model="gemini-2.0-flash",
    description="Shows trending products and user browsing history",
    instruction="""
        You suggest products based on trends and user history.
        Keep response conversational and under 2 sentences.
        Mention why you are recommending the product.
    """,
    tools=[
        get_trending_products,
        get_recently_viewed,
        track_product_view,
    ]
)
```

---

## Phase B — After Member 1 finishes (swap stubs for real Valkey)

Replace stub bodies with real Valkey calls:

```python
# backend/tools/search_tools.py  ← REAL VERSION (Phase B)
import json
from valkey_client import r

def search_by_keyword(query: str) -> dict:
    """Search products by any keyword.

    Args:
        query: What the user is looking for e.g. 'wireless headphones'

    Returns:
        List of matching products with name, price, rating
    """
    try:
        results = r.execute_command("FT.SEARCH", "idx:products", query, "LIMIT", "0", "6")
        return _parse_results(results)
    except Exception as e:
        return {"products": [], "error": str(e)}

def search_by_brand(brand: str) -> dict:
    """Search all products from a specific brand.

    Args:
        brand: Brand name e.g. 'Samsung', 'Apple', 'Sony'

    Returns:
        List of products from that brand
    """
    try:
        query = f"@brand:{{{brand}}}"
        results = r.execute_command("FT.SEARCH", "idx:products", query, "LIMIT", "0", "8")
        return _parse_results(results)
    except Exception as e:
        return {"products": [], "error": str(e)}

def search_by_price_range(min_price: int, max_price: int) -> dict:
    """Search products within a price range.

    Args:
        min_price: Minimum price in rupees
        max_price: Maximum price in rupees

    Returns:
        Products within that price range sorted by price
    """
    try:
        query = f"@price:[{min_price} {max_price}]"
        results = r.execute_command(
            "FT.SEARCH", "idx:products", query,
            "SORTBY", "price", "ASC",
            "LIMIT", "0", "8"
        )
        return _parse_results(results)
    except Exception as e:
        return {"products": [], "error": str(e)}

def search_by_category(category: str) -> dict:
    """Search products by category.

    Args:
        category: e.g. 'smartphones', 'headphones', 'shoes', 'televisions'

    Returns:
        Products in that category
    """
    try:
        query = f"@category:{{{category}}}"
        results = r.execute_command("FT.SEARCH", "idx:products", query, "LIMIT", "0", "8")
        return _parse_results(results)
    except Exception as e:
        return {"products": [], "error": str(e)}

def get_product_details(product_id: str) -> dict:
    """Get full details of a specific product.

    Args:
        product_id: e.g. 'product:01-samsung-a54'

    Returns:
        Full product details
    """
    data = r.execute_command("JSON.GET", product_id)
    if data:
        return json.loads(data)
    return {"error": "Product not found"}

def get_top_rated_products() -> dict:
    """Get the highest rated products in the store.

    Returns:
        Top 5 products by customer rating
    """
    try:
        results = r.execute_command(
            "FT.SEARCH", "idx:products", "*",
            "SORTBY", "rating", "DESC",
            "LIMIT", "0", "5"
        )
        return _parse_results(results)
    except Exception as e:
        return {"products": [], "error": str(e)}

def _parse_results(raw) -> dict:
    products = []
    if not raw or len(raw) < 2:
        return {"products": [], "count": 0}
    i = 1
    while i < len(raw):
        key = raw[i]
        data = r.execute_command("JSON.GET", key)
        if data:
            products.append(json.loads(data))
        i += 2
    return {"products": products, "count": len(products)}
```

```python
# backend/tools/discovery_tools.py  ← REAL VERSION (Phase B)
import json
from valkey_client import r

def get_trending_products() -> dict:
    """Get the most trending products right now.

    Returns:
        Top 5 trending products based on views and purchases
    """
    results = r.zrevrange("trending:global", 0, 4, withscores=True)
    products = []
    for product_id, score in results:
        data = r.execute_command("JSON.GET", product_id)
        if data:
            p = json.loads(data)
            p["trend_score"] = score
            products.append(p)
    return {"products": products, "count": len(products)}

def track_product_view(session_id: str, product_id: str) -> dict:
    """Track that a user viewed a product.

    Args:
        session_id: Current user session
        product_id: Product that was viewed

    Returns:
        Confirmation
    """
    r.lpush(f"user_history:{session_id}", product_id)
    r.ltrim(f"user_history:{session_id}", 0, 49)
    r.expire(f"user_history:{session_id}", 3600)
    r.zincrby("trending:global", 1, product_id)
    return {"status": "tracked"}

def get_recently_viewed(session_id: str) -> dict:
    """Get products the user recently viewed.

    Args:
        session_id: Current user session

    Returns:
        Last 5 viewed products
    """
    product_ids = r.lrange(f"user_history:{session_id}", 0, 4)
    products = []
    for pid in product_ids:
        data = r.execute_command("JSON.GET", pid)
        if data:
            products.append(json.loads(data))
    return {"products": products, "count": len(products)}
```

**After Phase B done — uncomment in orchestrator.py:**

```python
from agents.search_agent import search_agent
from agents.discovery_agent import discovery_agent
# add to sub_agents list
```

---

---

# MEMBER 3 — Cart & Order Agent

## Phase A — While Member 1 is building (work on stubs now)

```python
# backend/tools/cart_tools.py  ← STUB VERSION (Phase A)

def add_to_cart(session_id: str, product_id: str, quantity: int = 1) -> dict:
    """Add a product to the user's shopping cart.

    Args:
        session_id: Current user session ID
        product_id: Product ID to add e.g. 'product:01-samsung-a54'
        quantity: How many to add, default is 1

    Returns:
        Confirmation with product name and cart count
    """
    # STUB — replace in Phase B
    return {"status": "added", "product_name": "Sample Product", "quantity": quantity, "cart_total_items": 1}

def remove_from_cart(session_id: str, product_id: str) -> dict:
    """Remove a product from the user's cart.

    Args:
        session_id: Current user session ID
        product_id: Product ID to remove

    Returns:
        Confirmation of removal
    """
    # STUB — replace in Phase B
    return {"status": "removed", "product_id": product_id}

def update_quantity(session_id: str, product_id: str, quantity: int) -> dict:
    """Update the quantity of a product already in the cart.

    Args:
        session_id: Current user session ID
        product_id: Product ID to update
        quantity: New quantity

    Returns:
        Confirmation with updated quantity
    """
    # STUB — replace in Phase B
    return {"status": "updated", "quantity": quantity}

def get_cart(session_id: str) -> dict:
    """Get all items in the user's cart with prices and total.

    Args:
        session_id: Current user session ID

    Returns:
        Cart items with names, quantities, prices, and grand total
    """
    # STUB — replace in Phase B
    return {"items": [], "total": 0, "message": "Cart is empty"}

def clear_cart(session_id: str) -> dict:
    """Clear all items from the user's cart.

    Args:
        session_id: Current user session ID

    Returns:
        Confirmation
    """
    # STUB — replace in Phase B
    return {"status": "cart_cleared"}

def apply_coupon(session_id: str, coupon_code: str) -> dict:
    """Apply a discount coupon to the cart.

    Args:
        session_id: Current user session ID
        coupon_code: Coupon code e.g. 'SAVE10'

    Returns:
        Discount details if valid, error if not
    """
    # STUB — replace in Phase B
    return {"status": "applied", "code": coupon_code, "discount_value": 10}
```

```python
# backend/tools/order_tools.py  ← STUB VERSION (Phase A)

def get_cart_total(session_id: str) -> dict:
    """Get full cart total before placing order.

    Args:
        session_id: Current user session ID

    Returns:
        Itemized total with discount and grand total
    """
    # STUB — replace in Phase B
    return {"subtotal": 38999, "discount": 0, "total": 38999}

def place_order(session_id: str, user_id: str = "guest") -> dict:
    """Place the order for all items in the cart.

    Args:
        session_id: Current user session ID
        user_id: User ID, 'guest' for anonymous

    Returns:
        Order confirmation with order ID and total
    """
    # STUB — replace in Phase B
    return {"status": "order_placed", "order_id": "order:stub-123", "total": 38999}

def get_order_history(user_id: str) -> dict:
    """Get the user's past orders.

    Args:
        user_id: User ID

    Returns:
        List of recent orders
    """
    # STUB — replace in Phase B
    return {"orders": [], "count": 0}

def get_order_status(order_id: str) -> dict:
    """Get status of a specific order.

    Args:
        order_id: The order ID to check

    Returns:
        Order status and total
    """
    # STUB — replace in Phase B
    return {"order_id": order_id, "status": "confirmed", "total": 38999}
```

Write agents using stubs:

```python
# backend/agents/cart_agent.py
from google.adk.agents import Agent
from tools.cart_tools import (
    add_to_cart,
    remove_from_cart,
    update_quantity,
    get_cart,
    clear_cart,
    apply_coupon,
)

cart_agent = Agent(
    name="cart_agent",
    model="gemini-2.0-flash",
    description="Manages shopping cart — add, remove, view, update",
    instruction="""
        You manage the user's shopping cart.
        Always confirm the action you took.
        Say the product name, not the ID.
        Keep responses under 2 sentences.
        Example: "Added Sony headphones to your cart. You now have 2 items."
    """,
    tools=[add_to_cart, remove_from_cart, update_quantity, get_cart, clear_cart, apply_coupon]
)
```

```python
# backend/agents/order_agent.py
from google.adk.agents import Agent
from tools.order_tools import (
    get_cart_total,
    place_order,
    get_order_history,
    get_order_status,
)

order_agent = Agent(
    name="order_agent",
    model="gemini-2.0-flash",
    description="Handles checkout, order placement, and order history",
    instruction="""
        You handle orders and checkout.
        Before placing, always read back total: "Your total is ₹X. Shall I place the order?"
        After placing, read the order ID clearly.
        Keep responses short and clear.
    """,
    tools=[get_cart_total, place_order, get_order_history, get_order_status]
)
```

---

## Phase B — After Member 1 finishes (swap stubs for real Valkey)

```python
# backend/tools/cart_tools.py  ← REAL VERSION (Phase B)
import json
from valkey_client import r
from config import CART_TTL

def add_to_cart(session_id: str, product_id: str, quantity: int = 1) -> dict:
    """Add a product to the user's shopping cart.

    Args:
        session_id: Current user session ID
        product_id: Product ID to add e.g. 'product:01-samsung-a54'
        quantity: How many to add, default is 1

    Returns:
        Confirmation with product name and cart count
    """
    product_data = r.execute_command("JSON.GET", product_id)
    if not product_data:
        return {"error": "Product not found"}
    product = json.loads(product_data)
    r.hset(f"cart:{session_id}", product_id, quantity)
    r.expire(f"cart:{session_id}", CART_TTL)
    r.zincrby("trending:global", 3, product_id)
    cart_count = len(r.hgetall(f"cart:{session_id}"))
    return {
        "status": "added",
        "product_name": product["name"],
        "price": product["price"],
        "quantity": quantity,
        "cart_total_items": cart_count
    }

def remove_from_cart(session_id: str, product_id: str) -> dict:
    """Remove a product from the user's cart.

    Args:
        session_id: Current user session ID
        product_id: Product ID to remove

    Returns:
        Confirmation of removal
    """
    removed = r.hdel(f"cart:{session_id}", product_id)
    if removed:
        return {"status": "removed", "product_id": product_id}
    return {"error": "Product not in cart"}

def update_quantity(session_id: str, product_id: str, quantity: int) -> dict:
    """Update the quantity of a product already in the cart.

    Args:
        session_id: Current user session ID
        product_id: Product ID to update
        quantity: New quantity

    Returns:
        Confirmation with updated quantity
    """
    if not r.hexists(f"cart:{session_id}", product_id):
        return {"error": "Product not in cart"}
    r.hset(f"cart:{session_id}", product_id, quantity)
    return {"status": "updated", "product_id": product_id, "quantity": quantity}

def get_cart(session_id: str) -> dict:
    """Get all items in the user's cart with prices and total.

    Args:
        session_id: Current user session ID

    Returns:
        Cart items with names, quantities, prices, and grand total
    """
    raw_cart = r.hgetall(f"cart:{session_id}")
    if not raw_cart:
        return {"items": [], "total": 0, "message": "Cart is empty"}
    items = []
    total = 0
    for product_id, quantity in raw_cart.items():
        data = r.execute_command("JSON.GET", product_id)
        if data:
            product = json.loads(data)
            qty = int(quantity)
            subtotal = product["price"] * qty
            total += subtotal
            items.append({
                "product_id": product_id,
                "name": product["name"],
                "price": product["price"],
                "quantity": qty,
                "subtotal": subtotal
            })
    return {"items": items, "total": total, "item_count": len(items)}

def clear_cart(session_id: str) -> dict:
    """Clear all items from the user's cart.

    Args:
        session_id: Current user session ID

    Returns:
        Confirmation
    """
    r.delete(f"cart:{session_id}")
    return {"status": "cart_cleared"}

def apply_coupon(session_id: str, coupon_code: str) -> dict:
    """Apply a discount coupon to the cart.

    Args:
        session_id: Current user session ID
        coupon_code: Coupon code e.g. 'SAVE10'

    Returns:
        Discount details if valid, error if not
    """
    coupon_data = r.execute_command("JSON.GET", f"coupon:{coupon_code.upper()}")
    if not coupon_data:
        return {"error": "Invalid coupon code"}
    coupon = json.loads(coupon_data)
    if not coupon.get("active"):
        return {"error": "Coupon expired"}
    r.hset(f"cart_meta:{session_id}", "coupon", coupon_code.upper())
    return {"status": "applied", "code": coupon_code.upper(), "discount_type": coupon["type"], "discount_value": coupon["value"]}
```

```python
# backend/tools/order_tools.py  ← REAL VERSION (Phase B)
import json, time
from uuid import uuid4
from valkey_client import r

def get_cart_total(session_id: str) -> dict:
    """Get full cart total before placing order.

    Args:
        session_id: Current user session ID

    Returns:
        Itemized total with discount and grand total
    """
    raw_cart = r.hgetall(f"cart:{session_id}")
    if not raw_cart:
        return {"total": 0, "message": "Cart is empty"}
    items, total = [], 0
    for product_id, quantity in raw_cart.items():
        data = r.execute_command("JSON.GET", product_id)
        if data:
            product = json.loads(data)
            qty = int(quantity)
            subtotal = product["price"] * qty
            total += subtotal
            items.append({"name": product["name"], "qty": qty, "subtotal": subtotal})
    meta = r.hgetall(f"cart_meta:{session_id}")
    discount = 0
    if meta.get("coupon"):
        coupon_data = r.execute_command("JSON.GET", f"coupon:{meta['coupon']}")
        if coupon_data:
            coupon = json.loads(coupon_data)
            discount = int(total * coupon["value"] / 100) if coupon["type"] == "percentage" else coupon["value"]
    return {"items": items, "subtotal": total, "discount": discount, "total": total - discount}

def place_order(session_id: str, user_id: str = "guest") -> dict:
    """Place the order for all items in the cart.

    Args:
        session_id: Current user session ID
        user_id: User ID, 'guest' for anonymous

    Returns:
        Order confirmation with order ID and total
    """
    cart = r.hgetall(f"cart:{session_id}")
    if not cart:
        return {"error": "Cart is empty"}
    order_id = f"order:{uuid4()}"
    timestamp = int(time.time())
    items, total = [], 0
    for product_id, quantity in cart.items():
        data = r.execute_command("JSON.GET", product_id)
        if data:
            product = json.loads(data)
            qty = int(quantity)
            subtotal = product["price"] * qty
            total += subtotal
            items.append({"product_id": product_id, "name": product["name"], "quantity": qty, "price": product["price"], "subtotal": subtotal})
            r.zincrby("trending:global", 5, product_id)
    order = {"id": order_id, "user_id": user_id, "items": items, "total": total, "status": "confirmed", "created_at": timestamp}
    r.execute_command("JSON.SET", order_id, "$", json.dumps(order))
    r.expire(order_id, 2592000)
    r.zadd(f"user_orders:{user_id}", {order_id: timestamp})
    r.delete(f"cart:{session_id}")
    r.delete(f"cart_meta:{session_id}")
    return {"status": "order_placed", "order_id": order_id, "total": total, "item_count": len(items)}

def get_order_history(user_id: str) -> dict:
    """Get the user's past orders.

    Args:
        user_id: User ID

    Returns:
        List of recent orders
    """
    order_ids = r.zrevrange(f"user_orders:{user_id}", 0, 4)
    orders = []
    for oid in order_ids:
        data = r.execute_command("JSON.GET", oid)
        if data:
            order = json.loads(data)
            orders.append({"order_id": oid, "total": order["total"], "status": order["status"], "item_count": len(order["items"])})
    return {"orders": orders, "count": len(orders)}

def get_order_status(order_id: str) -> dict:
    """Get status of a specific order.

    Args:
        order_id: The order ID to check

    Returns:
        Order status and total
    """
    data = r.execute_command("JSON.GET", order_id)
    if data:
        order = json.loads(data)
        return {"order_id": order_id, "status": order["status"], "total": order["total"]}
    return {"error": "Order not found"}
```

**After Phase B done — uncomment in orchestrator.py:**

```python
from agents.cart_agent import cart_agent
from agents.order_agent import order_agent
# add to sub_agents list
```

---

---

# MEMBER 4 — Frontend & Voice UI

**You are fully independent. Start immediately. You do not need the backend to be running.**

Use the mock API below to simulate responses while backend is being built.

---

## Phase A — Build with Mock API (start now)

```js
// frontend/src/api/mockApi.js  ← USE THIS until backend is ready

export async function sendMessage(message, sessionId) {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));

  const lower = message.toLowerCase();

  if (lower.includes("samsung")) {
    return {
      response: "Found 2 Samsung products. Galaxy A54 at ₹38,999 and Samsung 55 inch TV at ₹54,999.",
      products: [
        { id: "product:01-samsung-a54", name: "Samsung Galaxy A54", price: 38999, rating: 4.5, image: "" },
        { id: "product:05-samsung-tv", name: "Samsung 55 inch 4K TV", price: 54999, rating: 4.6, image: "" }
      ]
    };
  }
  if (lower.includes("add") || lower.includes("cart")) {
    return { response: "Added Samsung Galaxy A54 to your cart. You now have 1 item.", products: [] };
  }
  if (lower.includes("trending")) {
    return {
      response: "Top trending right now: Sony WH-1000XM5 and Apple AirPods Pro.",
      products: [
        { id: "product:03-sony-wh1000", name: "Sony WH-1000XM5", price: 29999, rating: 4.7, image: "" },
        { id: "product:06-apple-airpods", name: "Apple AirPods Pro 2", price: 24999, rating: 4.9, image: "" }
      ]
    };
  }
  return { response: "I can help you find products, manage your cart, and place orders. Try saying 'Show me Samsung phones'.", products: [] };
}
```

## Phase B — Switch to Real API (when backend is ready)

```js
// frontend/src/api/chatApi.js  ← SWITCH TO THIS when backend is ready

export async function sendMessage(message, sessionId) {
  const res = await fetch("http://localhost:8000/api/agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId })
  });
  return await res.json();
}
```

Just change the import in VoiceChat.jsx from `mockApi` to `chatApi`. One line change.

---

## Components to Build

### useVoice.js (custom hook)

```js
// frontend/src/hooks/useVoice.js
import { useState, useEffect, useRef } from "react";

export function useVoice(onTranscript) {
  const [status, setStatus] = useState("idle");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      onTranscript(e.results[0][0].transcript);
      setStatus("idle");
    };
    rec.onerror = () => setStatus("idle");
    rec.onend = () => setStatus(s => s === "listening" ? "idle" : s);
    recognitionRef.current = rec;
  }, []);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 1.0;
    setStatus("speaking");
    u.onend = () => setStatus("idle");
    window.speechSynthesis.speak(u);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setStatus("listening");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setStatus("idle");
  };

  return { status, startListening, stopListening, speak };
}
```

### VoiceButton.jsx

```jsx
// frontend/src/components/VoiceButton.jsx
export default function VoiceButton({ status, onPress }) {
  const isListening = status === "listening";

  return (
    <button
      onClick={onPress}
      style={{
        width: 90, height: 90, borderRadius: "50%",
        background: isListening ? "#FF4444" : "#6941C6",
        border: "none", cursor: "pointer",
        fontSize: 36, color: "white",
        boxShadow: isListening ? "0 0 0 12px rgba(255,68,68,0.2)" : "0 4px 16px rgba(105,65,198,0.4)",
        transition: "all 0.2s ease",
        animation: isListening ? "pulse 1s infinite" : "none"
      }}
    >
      {isListening ? "🔴" : "🎤"}
    </button>
  );
}
```

### ProductCard.jsx

```jsx
// frontend/src/components/ProductCard.jsx
export default function ProductCard({ product }) {
  return (
    <div style={{
      border: "1px solid #E5E7EB",
      borderRadius: 12,
      padding: 14,
      width: 150,
      fontSize: 13,
      background: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
    }}>
      {product.image && (
        <img src={product.image} alt={product.name}
          style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
      )}
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{product.name}</div>
      <div style={{ color: "#6941C6", fontWeight: 700 }}>₹{product.price?.toLocaleString()}</div>
      <div style={{ color: "#F59E0B", fontSize: 12 }}>⭐ {product.rating}</div>
    </div>
  );
}
```

### VoiceChat.jsx (main component)

```jsx
// frontend/src/components/VoiceChat.jsx
import { useState } from "react";
import { useVoice } from "../hooks/useVoice";
import VoiceButton from "./VoiceButton";
import ProductCard from "./ProductCard";
import { sendMessage } from "../api/mockApi"; // switch to chatApi when backend ready

const SESSION_ID = "session_" + Math.random().toString(36).slice(2);

const STATUS_LABELS = {
  idle: "Tap mic and speak",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking..."
};

export default function VoiceChat() {
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [thinking, setThinking] = useState(false);

  const handleTranscript = async (transcript) => {
    setMessages(prev => [...prev, { role: "user", text: transcript }]);
    setThinking(true);

    const data = await sendMessage(transcript, SESSION_ID);
    setThinking(false);

    setMessages(prev => [...prev, { role: "agent", text: data.response }]);
    if (data.products?.length > 0) setProducts(data.products);
    speak(data.response);
  };

  const currentStatus = thinking ? "thinking" : status;
  const { status, startListening, speak } = useVoice(handleTranscript);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>

      <h2 style={{ textAlign: "center", color: "#6941C6" }}>🛒 VoiceCart AI</h2>

      {/* Status */}
      <p style={{ textAlign: "center", color: "#9CA3AF", marginBottom: 20 }}>
        {STATUS_LABELS[currentStatus]}
      </p>

      {/* Mic Button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <VoiceButton status={currentStatus} onPress={startListening} />
      </div>

      {/* Product Cards */}
      {products.length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          {products.map((p, i) => <ProductCard key={i} product={p} />)}
        </div>
      )}

      {/* Chat Messages */}
      <div style={{ maxHeight: 280, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 8
          }}>
            <div style={{
              background: m.role === "user" ? "#6941C6" : "#F3F4F6",
              color: m.role === "user" ? "#fff" : "#111",
              borderRadius: 12, padding: "8px 14px",
              maxWidth: "80%", fontSize: 14
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
```

### Add pulse animation to index.css

```css
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.4); }
  70%  { box-shadow: 0 0 0 16px rgba(255, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
}
```

---

---

# Final Integration (All Members Together)

Once all four members are done, do this:

**1. Update orchestrator.py (Member 1 does this)**

```python
# backend/orchestrator.py — FINAL
import os
from google.adk.agents import Agent
from config import GOOGLE_API_KEY
from agents.search_agent import search_agent
from agents.discovery_agent import discovery_agent
from agents.cart_agent import cart_agent
from agents.order_agent import order_agent

os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

orchestrator = Agent(
    name="orchestrator",
    model="gemini-2.0-flash",
    description="Root voice shopping assistant",
    instruction="""
        You are VoiceCart, a friendly voice shopping assistant.
        Route to the right specialist. Keep all responses under 2 sentences.
        Use ₹ for prices. Confirm every cart action by product name.
    """,
    sub_agents=[search_agent, discovery_agent, cart_agent, order_agent]
)
```

**2. Member 4 switches import (one line)**

```js
// VoiceChat.jsx — change this:
import { sendMessage } from "../api/mockApi";
// to this:
import { sendMessage } from "../api/chatApi";
```

**3. Start everything**

```bash
# Terminal 1 — Valkey
docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:9-alpine

# Terminal 2 — Backend
cd backend && python main.py

# Terminal 3 — Frontend
cd frontend && npm start
```

---

# Git Workflow

```bash
# Member 1
git checkout -b foundation
git add . && git commit -m "Foundation: Valkey, seed data, FastAPI base"
git push && git checkout main && git merge foundation

# Member 2
git checkout -b feature/search-agent
# ... do work ...
git add . && git commit -m "Add search and discovery agents"
git push origin feature/search-agent

# Member 3
git checkout -b feature/cart-order-agent
# ... do work ...
git add . && git commit -m "Add cart and order agents"
git push origin feature/cart-order-agent

# Member 4
git checkout -b feature/voice-frontend
# ... do work ...
git add . && git commit -m "Add voice UI components"
git push origin feature/voice-frontend
```

---

# Valkey Keys Reference

| Key | Type | Owner |
|-----|------|-------|
| `product:{id}` | JSON | Member 1 seeds |
| `idx:products` | FT Index | Member 1 creates |
| `trending:global` | Sorted Set | Member 2 reads/writes |
| `user_history:{session}` | List | Member 2 writes |
| `cart:{session}` | Hash | Member 3 writes |
| `cart_meta:{session}` | Hash | Member 3 writes |
| `order:{uuid}` | JSON | Member 3 writes |
| `user_orders:{user}` | Sorted Set | Member 3 writes |
| `coupon:{code}` | JSON | Member 1 seeds |
| `price_index` | Sorted Set | Member 1 seeds |

---

# API Contract

```
POST http://localhost:8000/api/agent/chat
Body:     { "message": "Show me Samsung phones", "session_id": "abc123" }
Response: { "response": "Found 2 Samsung phones...", "session_id": "abc123" }

GET http://localhost:8000/health
Response: { "status": "ok", "valkey": true }
```

---

# Demo Script

```
"Show me Samsung phones"             → search_agent finds products
"Which one is cheapest?"             → search_by_price_range
"Add the Galaxy A54 to my cart"      → cart_agent.add_to_cart
"Apply coupon SAVE10"                → cart_agent.apply_coupon
"What's my total?"                   → order_agent.get_cart_total
"Place my order"                     → order_agent.place_order
"What's trending today?"             → discovery_agent.get_trending
"What was I looking at earlier?"     → discovery_agent.get_recently_viewed
```

---

Good luck team! 🚀
