import uuid
import json
import logging
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field

from app.valkey import get_valkey, reserve_inventory_script
from app.routes.cart import calculate_cart_details, get_user_id

router = APIRouter(prefix="/api/checkout", tags=["checkout"])
logger = logging.getLogger(__name__)

# Schema definitions
class AddressSchema(BaseModel):
    street: str
    city: str
    state: str
    postalCode: str
    country: str

class CheckoutStartRequest(BaseModel):
    shippingAddress: AddressSchema

class ConfirmRequest(BaseModel):
    orderId: str
    paymentMethod: str = "upi"
    transactionId: str = "txn_mock123"

class OrderItem(BaseModel):
    productId: str
    sku: str
    name: str
    quantity: int
    price: int

class PaymentDetails(BaseModel):
    method: str
    transactionId: str
    status: str

class OrderResponse(BaseModel):
    id: str
    userId: str
    status: str
    items: List[OrderItem]
    subtotal: int
    discount: int
    couponCode: Optional[str] = None
    tax: int
    shipping: int
    total: int
    shippingAddress: AddressSchema
    payment: Optional[PaymentDetails] = None
    createdAt: str
    updatedAt: str

@router.post("/start", response_model=OrderResponse)
def start_checkout(
    req: CheckoutStartRequest,
    user_id: str = Depends(get_user_id),
    x_idempotency_key: Optional[str] = Header(None),
    r = Depends(get_valkey)
):
    """
    Initiates checkout, validates idempotency, checks stock and atomically reserves inventory using Lua script
    """
    if not x_idempotency_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="X-Idempotency-Key header is required for checkout."
        )

    # 1. Check Idempotency Key
    idem_key = f"idempotency:{x_idempotency_key}"
    existing_order_id = r.get(idem_key)
    
    if existing_order_id:
        logger.info("Idempotency hit! Returning existing order: %s", existing_order_id)
        order_key = existing_order_id if existing_order_id.startswith("order:") else f"order:{existing_order_id}"
        order_json = r.json().get(order_key)
        if order_json:
            if isinstance(order_json, list) and len(order_json) > 0:
                return order_json[0]
            return order_json
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Idempotency key exists but matching order details were not found."
        )

    # 2. Get Cart Details
    cart = calculate_cart_details(r, user_id)
    if not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot checkout with an empty cart."
        )

    # 3. Reserve Inventory Atomically using Lua Script
    reserved_products = []
    
    try:
        for item in cart.items:
            prod_key = f"product:{item.productId}" if not item.productId.startswith("product:") else item.productId
            # Run Lua script: 1 = success, 0 = failure
            success = reserve_inventory_script(keys=[prod_key], args=[item.quantity], client=r)
            
            if not success or success == 0:
                raise ValueError(item.productId)
            
            reserved_products.append((prod_key, item.quantity))
            
    except ValueError as e:
        failed_prod_id = str(e)
        # Rollback all successfully reserved products so far
        for prod_key, qty in reserved_products:
            r.json().numincrby(prod_key, "$.inventory.reserved", -qty)
            
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Checkout failed. Insufficient stock for product: {failed_prod_id}."
        )

    # 4. Generate Pending Order and temporary TTL-based reservations
    order_id = f"order:{uuid.uuid4()}"
    
    # Save reservation details with a 10 minute TTL
    for item in cart.items:
        res_key = f"reservation:{order_id}:{item.productId}"
        r.set(res_key, item.quantity, ex=600)

    # Calculations
    tax = int(cart.total * 0.18)  # 18% tax
    shipping = 0 if cart.total > 50000 else 5000  # Free shipping over 50000 paise (500 INR)
    grand_total = cart.total + tax + shipping

    now_iso = datetime.now(timezone.utc).isoformat()
    order_data = OrderResponse(
        id=order_id,
        userId=user_id,
        status="pending",
        items=[
            OrderItem(
                productId=item.productId,
                sku=item.sku,
                name=item.name,
                quantity=item.quantity,
                price=item.price
            ) for item in cart.items
        ],
        subtotal=cart.subtotal,
        discount=cart.discount,
        couponCode=cart.couponCode,
        tax=tax,
        shipping=shipping,
        total=grand_total,
        shippingAddress=req.shippingAddress,
        createdAt=now_iso,
        updatedAt=now_iso
    )

    # 5. Store Order JSON and Idempotency Record
    r.json().set(order_id, "$", order_data.model_dump())
    
    # Save user order history index (Sorted Set using timestamp as score)
    r.zadd(f"user_orders:{user_id}", {order_id: datetime.now(timezone.utc).timestamp()})
    
    # Commit the idempotency key (Expires in 24 hours)
    r.set(idem_key, order_id, nx=True, ex=86400)

    return order_data

@router.post("/confirm", response_model=OrderResponse)
def confirm_checkout(
    req: ConfirmRequest,
    user_id: str = Depends(get_user_id),
    r = Depends(get_valkey)
):
    """
    Confirms the order, processes payment mock, updates inventory levels permanently, and clears cart.
    """
    order_key = req.orderId if req.orderId.startswith("order:") else f"order:{req.orderId}"
    order_json = r.json().get(order_key)
    
    if not order_json:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found."
        )
        
    if isinstance(order_json, list) and len(order_json) > 0:
        order = order_json[0]
    else:
        order = order_json

    if order.get("userId") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized order access."
        )

    if order.get("status") != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Order status must be pending to confirm. Current status: {order.get('status')}."
        )

    # 1. Validate Reservations are intact (not expired after 10 minutes)
    for item in order["items"]:
        prod_id = item["productId"]
        res_key = f"reservation:{order['id']}:{prod_id}"
        
        if not r.exists(res_key):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Checkout window expired. Inventory reservation for product {prod_id} has timed out."
            )

    # 2. Commit Inventory Updates Permanently
    for item in order["items"]:
        prod_id = item["productId"]
        qty = item["quantity"]
        prod_key = f"product:{prod_id}" if not prod_id.startswith("product:") else prod_id
        res_key = f"reservation:{order['id']}:{prod_id}"
        
        # Decrement quantity and reserved fields
        r.json().numincrby(prod_key, "$.inventory.quantity", -qty)
        r.json().numincrby(prod_key, "$.inventory.reserved", -qty)
        r.delete(res_key)

    # 3. If Coupon was used, increment global count and track user usage
    coupon_code = order.get("couponCode")
    if coupon_code:
        r.sadd(f"coupon_used:{coupon_code}", user_id)
        r.json().numincrby(f"coupon:{coupon_code}", "$.usedCount", 1)

    # 4. Update Order Status
    order["status"] = "confirmed"
    order["payment"] = {
        "method": req.paymentMethod,
        "transactionId": req.transactionId,
        "status": "captured"
    }
    order["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    # Save back to Valkey JSON
    r.json().set(order_key, "$", order)

    # 5. Clear User's Cart
    r.delete(f"cart:{user_id}")
    r.delete(f"cart:{user_id}:coupon")

    return OrderResponse(**order)

@router.post("/cancel", response_model=OrderResponse)
def cancel_checkout(
    order_id_req: str,
    user_id: str = Depends(get_user_id),
    r = Depends(get_valkey)
):
    """
    Cancels a pending order, releases reserved inventory, and deletes the reservation keys.
    """
    order_key = order_id_req if order_id_req.startswith("order:") else f"order:{order_id_req}"
    order_json = r.json().get(order_key)
    
    if not order_json:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found."
        )
        
    if isinstance(order_json, list) and len(order_json) > 0:
        order = order_json[0]
    else:
        order = order_json

    if order.get("userId") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized order access."
        )

    if order.get("status") != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only pending orders can be cancelled. Current status: {order.get('status')}."
        )

    # Release reservations
    for item in order["items"]:
        prod_id = item["productId"]
        qty = item["quantity"]
        prod_key = f"product:{prod_id}" if not prod_id.startswith("product:") else prod_id
        res_key = f"reservation:{order['id']}:{prod_id}"
        
        # Free reservation from product statistics
        r.json().numincrby(prod_key, "$.inventory.reserved", -qty)
        r.delete(res_key)

    order["status"] = "cancelled"
    order["updatedAt"] = datetime.now(timezone.utc).isoformat()
    r.json().set(order_key, "$", order)

    return OrderResponse(**order)
