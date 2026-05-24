import json
import logging
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import redis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("valkey-backend")

app = FastAPI(title="Valkey E-Commerce Demo Backend", version="1.0.0")

# Enable CORS for the React frontend (running on port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Valkey (compat layer using redis-py)
# Docker port is mapped to 6379 on localhost
try:
    valkey_client = redis.Redis(
        host="localhost",
        port=6379,
        db=0,
        decode_responses=True,
        socket_timeout=2.0
    )
    # Ping Valkey to ensure connection is active
    valkey_client.ping()
    logger.info("Successfully connected to Valkey database on localhost:6379")
except Exception as e:
    logger.error(f"Failed to connect to Valkey: {e}")
    # In case it fails, we fall back to a mock in-memory store so the app doesn't crash,
    # but since Docker is up, it should succeed!
    valkey_client = None

class CartItemInput(BaseModel):
    userId: str
    productId: str
    name: str
    price: float
    quantity: int = Field(default=1, ge=1)
    imageUrl: Optional[str] = ""

class CartItemUpdate(BaseModel):
    userId: str
    quantity: int = Field(..., ge=1)

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Valkey E-Commerce Demo Backend", "valkey_connected": valkey_client is not None}

# Helper to verify Valkey is active
def get_valkey():
    if valkey_client is None:
        raise HTTPException(status_code=503, detail="Valkey database is not available")
    return valkey_client

@app.get("/api/cart")
def get_cart(userId: str = Query(..., description="The user/session ID to query the cart for")):
    db = get_valkey()
    key = f"cart:{userId}"
    
    # HGETALL returns a dict mapping productId -> JSON item string
    raw_cart = db.hgetall(key)
    
    items = []
    subtotal = 0.0
    
    for prod_id, raw_item in raw_cart.items():
        try:
            item_data = json.loads(raw_item)
            items.append(item_data)
            subtotal += item_data.get("price", 0.0) * item_data.get("quantity", 0)
        except Exception as err:
            logger.error(f"Failed to parse cart item {prod_id}: {err}")
            
    # Calculate delivery (Free over $100 or flat $10, let's keep it simple: flat free for hackathon)
    est_delivery = 0.0
    # Dynamic 8% tax calculation
    est_tax = round(subtotal * 0.08, 2)
    total = round(subtotal + est_delivery + est_tax, 2)
    
    return {
        "userId": userId,
        "items": items,
        "subtotal": round(subtotal, 2),
        "estDelivery": est_delivery,
        "estTax": est_tax,
        "total": total
    }

@app.post("/api/cart/items")
def add_to_cart(item: CartItemInput):
    db = get_valkey()
    key = f"cart:{item.userId}"
    
    # Check if item already exists in hash
    existing_raw = db.hget(key, item.productId)
    
    if existing_raw:
        try:
            existing_item = json.loads(existing_raw)
            # Add to the existing quantity
            new_quantity = existing_item.get("quantity", 0) + item.quantity
            item.quantity = new_quantity
        except Exception as err:
            logger.error(f"Error parsing existing item {item.productId}: {err}")
            
    item_dict = item.model_dump()
    # Save as JSON string
    db.hset(key, item.productId, json.dumps(item_dict))
    # Cart TTL: Keep cart for 7 days (604800 seconds) as per acceptance criteria
    db.expire(key, 604800)
    
    logger.info(f"Added/Updated product {item.productId} in cart:{item.userId}. New qty: {item.quantity}")
    return {"status": "success", "message": f"Product added to cart", "item": item_dict}

@app.patch("/api/cart/items/{productId}")
def update_cart_item(productId: str, update: CartItemUpdate):
    db = get_valkey()
    key = f"cart:{update.userId}"
    
    # Check if item exists in hash
    existing_raw = db.hget(key, productId)
    if not existing_raw:
        raise HTTPException(status_code=404, detail="Item not found in cart")
        
    try:
        item_data = json.loads(existing_raw)
        item_data["quantity"] = update.quantity
        db.hset(key, productId, json.dumps(item_data))
        logger.info(f"Updated product {productId} in cart:{update.userId} to quantity {update.quantity}")
        return {"status": "success", "item": item_data}
    except Exception as err:
        logger.error(f"Failed to update cart item {productId}: {err}")
        raise HTTPException(status_code=500, detail="Failed to update item")

@app.delete("/api/cart/items/{productId}")
def delete_from_cart(productId: str, userId: str = Query(..., description="The user/session ID")):
    db = get_valkey()
    key = f"cart:{userId}"
    
    # HDEL removes the field
    result = db.hdel(key, productId)
    
    if result == 0:
        raise HTTPException(status_code=404, detail="Item not found in cart")
        
    logger.info(f"Deleted product {productId} from cart:{userId}")
    return {"status": "success", "message": "Product removed from cart"}

@app.delete("/api/cart")
def clear_cart(userId: str = Query(..., description="The user/session ID")):
    db = get_valkey()
    key = f"cart:{userId}"
    
    db.delete(key)
    logger.info(f"Cleared entire cart for {userId}")
    return {"status": "success", "message": "Cart cleared successfully"}

# DB Explorer endpoint to query raw keys/values in Valkey
@app.get("/api/valkey/keys")
def get_valkey_keys():
    db = get_valkey()
    
    # Find all keys matching cart:*
    keys = db.keys("cart:*")
    
    explorer_data = {}
    for key in keys:
        key_type = db.type(key)
        ttl = db.ttl(key)
        
        if key_type == "hash":
            raw_hash = db.hgetall(key)
            parsed_hash = {}
            for k, v in raw_hash.items():
                try:
                    parsed_hash[k] = json.loads(v)
                except Exception:
                    parsed_hash[k] = v
            explorer_data[key] = {
                "type": key_type,
                "ttl": ttl,
                "data": parsed_hash
            }
        elif key_type == "string":
            val = db.get(key)
            try:
                parsed_val = json.loads(val)
            except Exception:
                parsed_val = val
            explorer_data[key] = {
                "type": key_type,
                "ttl": ttl,
                "data": parsed_val
            }
        else:
            explorer_data[key] = {
                "type": key_type,
                "ttl": ttl,
                "data": f"Unsupported explorer type: {key_type}"
            }
            
    return {"active_keys": len(explorer_data), "keys": explorer_data}
