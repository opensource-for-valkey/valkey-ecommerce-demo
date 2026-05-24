import json
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field

from app.valkey import get_valkey

router = APIRouter(prefix="/api/cart", tags=["cart"])

# Schema definitions
class CartItemInput(BaseModel):
    productId: str = Field(..., description="Unique product ID starting with 'product:'")
    quantity: int = Field(..., gt=0, description="Quantity to add, must be greater than 0")

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., description="New quantity of the item")

class CouponInput(BaseModel):
    code: str = Field(..., description="Coupon code to apply")

class CartItemResponse(BaseModel):
    productId: str
    sku: str
    name: str
    price: int  # in paise/cents or base currency unit
    quantity: int
    subtotal: int

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: int
    discount: int
    couponCode: Optional[str] = None
    total: int

def get_user_id(x_user_id: str = Header(default="user:0192d4e0-7b3a-7f5c-9e1a-4b8c2d6f0a1e")) -> str:
    """Extract user_id from custom header; defaults to a mock user"""
    return x_user_id

def validate_coupon_logic(r, coupon_code: str, user_id: str, subtotal: int) -> dict:
    """
    Validates a coupon code.
    Returns the parsed coupon dict if valid; raises HTTPException if invalid.
    """
    coupon_key = f"coupon:{coupon_code}"
    coupon_json = r.json().get(coupon_key)
    
    if not coupon_json:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coupon not found."
        )
    
    # Handle both serialized list and dict (depending on client library version)
    if isinstance(coupon_json, list) and len(coupon_json) > 0:
        coupon = coupon_json[0]
    else:
        coupon = coupon_json
        
    if not coupon.get("active", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This coupon is inactive."
        )
        
    # Validate expiry date
    now = datetime.now(timezone.utc)
    valid_from = datetime.fromisoformat(coupon["validFrom"].replace("Z", "+00:00"))
    valid_until = datetime.fromisoformat(coupon["validUntil"].replace("Z", "+00:00"))
    
    if now < valid_from or now > valid_until:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This coupon is expired or not yet valid."
        )
        
    # Check global usage limit
    used_count = coupon.get("usedCount", 0)
    usage_limit = coupon.get("usageLimit", 0)
    if used_count >= usage_limit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This coupon has reached its usage limit."
        )
        
    # Check if user has already used the coupon
    is_used = r.sismember(f"coupon_used:{coupon_code}", user_id)
    if is_used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already used this coupon."
        )
        
    # Check minimum order amount
    min_amount = coupon.get("minOrderAmount", 0)
    if subtotal < min_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Minimum order amount of {min_amount} is required to use this coupon."
        )
        
    return coupon

def calculate_cart_details(r, user_id: str) -> CartResponse:
    """Helper function to compile and calculate cart pricing, discounts, and item details"""
    cart_key = f"cart:{user_id}"
    cart_data = r.hgetall(cart_key)
    
    items: List[CartItemResponse] = []
    subtotal = 0
    
    if cart_data:
        for prod_id, qty_str in cart_data.items():
            qty = int(qty_str)
            prod_key = f"product:{prod_id}" if not prod_id.startswith("product:") else prod_id
            product_json = r.json().get(prod_key)
            
            if not product_json:
                continue
                
            if isinstance(product_json, list) and len(product_json) > 0:
                prod = product_json[0]
            else:
                prod = product_json
                
            price_amount = prod["price"]["amount"]
            item_subtotal = price_amount * qty
            subtotal += item_subtotal
            
            items.append(
                CartItemResponse(
                    productId=prod["id"],
                    sku=prod["sku"],
                    name=prod["name"],
                    price=price_amount,
                    quantity=qty,
                    subtotal=item_subtotal
                )
            )
            
        # Refresh cart expiry
        r.expire(cart_key, 604800)
        
    # Check for applied coupon
    coupon_code = r.get(f"cart:{user_id}:coupon")
    discount = 0
    
    if coupon_code and subtotal > 0:
        try:
            coupon = validate_coupon_logic(r, coupon_code, user_id, subtotal)
            if coupon["type"] == "percentage":
                calc_discount = int(subtotal * (coupon["value"] / 100.0))
                discount = min(calc_discount, coupon.get("maxDiscount", calc_discount))
            elif coupon["type"] == "fixed":
                discount = min(coupon["value"], subtotal)
                
            r.expire(f"cart:{user_id}:coupon", 604800)
        except HTTPException:
            # Coupon became invalid (e.g. min amount not met anymore), remove it silently
            r.delete(f"cart:{user_id}:coupon")
            coupon_code = None
            discount = 0
            
    total = max(0, subtotal - discount)
    
    return CartResponse(
        items=items,
        subtotal=subtotal,
        discount=discount,
        couponCode=coupon_code,
        total=total
    )

@router.get("", response_model=CartResponse)
def get_cart(user_id: str = Depends(get_user_id), r = Depends(get_valkey)):
    """Fetch persistent shopping cart for current user"""
    return calculate_cart_details(r, user_id)

@router.post("/items", response_model=CartResponse)
def add_to_cart(
    item: CartItemInput,
    user_id: str = Depends(get_user_id),
    r = Depends(get_valkey)
):
    """Add product to shopping cart with inventory checks"""
    prod_key = item.productId if item.productId.startswith("product:") else f"product:{item.productId}"
    product_json = r.json().get(prod_key)
    
    if not product_json:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found."
        )
        
    if isinstance(product_json, list) and len(product_json) > 0:
        prod = product_json[0]
    else:
        prod = product_json
        
    # Verify inventory limits to prevent overselling at cart stage
    inventory = prod.get("inventory", {})
    qty_in_stock = inventory.get("quantity", 0)
    qty_reserved = inventory.get("reserved", 0)
    qty_available = qty_in_stock - qty_reserved
    
    cart_key = f"cart:{user_id}"
    existing_qty_str = r.hget(cart_key, prod["id"])
    existing_qty = int(existing_qty_str) if existing_qty_str else 0
    new_total_qty = existing_qty + item.quantity
    
    if new_total_qty > qty_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot add {item.quantity} units. Only {qty_available} units are available."
        )
        
    r.hset(cart_key, prod["id"], new_total_qty)
    r.expire(cart_key, 604800)
    
    return calculate_cart_details(r, user_id)

@router.patch("/items/{productId}", response_model=CartResponse)
def update_cart_item(
    productId: str,
    item_update: CartItemUpdate,
    user_id: str = Depends(get_user_id),
    r = Depends(get_valkey)
):
    """Update quantity of a product in the cart"""
    cart_key = f"cart:{user_id}"
    prod_id = productId if productId.startswith("product:") else f"product:{productId}"
    
    # Check if item exists in cart
    if not r.hexists(cart_key, prod_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in cart."
        )
        
    if item_update.quantity <= 0:
        r.hdel(cart_key, prod_id)
    else:
        # Check inventory availability
        product_json = r.json().get(prod_id)
        if not product_json:
            r.hdel(cart_key, prod_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found."
            )
            
        if isinstance(product_json, list) and len(product_json) > 0:
            prod = product_json[0]
        else:
            prod = product_json
            
        inventory = prod.get("inventory", {})
        qty_in_stock = inventory.get("quantity", 0)
        qty_reserved = inventory.get("reserved", 0)
        qty_available = qty_in_stock - qty_reserved
        
        if item_update.quantity > qty_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Requested quantity of {item_update.quantity} exceeds available stock of {qty_available}."
            )
            
        r.hset(cart_key, prod_id, item_update.quantity)
        
    r.expire(cart_key, 604800)
    return calculate_cart_details(r, user_id)

@router.delete("/items/{productId}", response_model=CartResponse)
def remove_from_cart(
    productId: str,
    user_id: str = Depends(get_user_id),
    r = Depends(get_valkey)
):
    """Remove a product from the shopping cart"""
    cart_key = f"cart:{user_id}"
    prod_id = productId if productId.startswith("product:") else f"product:{productId}"
    
    r.hdel(cart_key, prod_id)
    r.expire(cart_key, 604800)
    return calculate_cart_details(r, user_id)

@router.post("/coupon", response_model=CartResponse)
def apply_coupon(
    coupon_input: CouponInput,
    user_id: str = Depends(get_user_id),
    r = Depends(get_valkey)
):
    """Validate and apply a coupon to the shopping cart"""
    # Calculate subtotal first to validate minOrderAmount
    cart_details = calculate_cart_details(r, user_id)
    if cart_details.subtotal == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot apply coupon to an empty cart."
        )
        
    # Validate coupon logic
    validate_coupon_logic(r, coupon_input.code, user_id, cart_details.subtotal)
    
    # Store coupon
    r.set(f"cart:{user_id}:coupon", coupon_input.code, ex=604800)
    return calculate_cart_details(r, user_id)

@router.delete("/coupon", response_model=CartResponse)
def remove_coupon(user_id: str = Depends(get_user_id), r = Depends(get_valkey)):
    """Remove coupon from the shopping cart"""
    r.delete(f"cart:{user_id}:coupon")
    return calculate_cart_details(r, user_id)
