"""Cart tools backed by Valkey.

The session id is taken from the ADK ToolContext (see _session_id) so the LLM
never has to pass it. This is what tied a cart write and read together —
without it the model invented different ids per call and the cart looked empty.

Data model:
  cart:{session_id}        -> hash of product_id -> quantity (TTL = CART_TTL)
  cart_coupon:{session_id} -> string holding the applied coupon code (TTL = CART_TTL)
"""
import json

from google.adk.tools.tool_context import ToolContext

from valkey_client import r
from config import CART_TTL


def _session_id(tool_context: ToolContext) -> str:
    """Pull the real session id out of the ADK invocation context.

    Preference order:
    1. Session state (`voicecart_session_id`) — survives AgentTool nesting since
       state is forwarded from parent to child.
    2. Invocation user_id — works when the tool runs directly under the root
       runner (e.g. unit tests, future callers without nesting).
    """
    state = getattr(tool_context, "state", None)
    if state is not None:
        try:
            sid = state.get("voicecart_session_id")
        except Exception:
            sid = None
        if sid:
            return sid
    return tool_context._invocation_context.user_id


def _cart_key(session_id: str) -> str:
    return f"cart:{session_id}"


def _coupon_key(session_id: str) -> str:
    return f"cart_coupon:{session_id}"


def _get_product(product_id: str) -> dict | None:
    raw = r.execute_command("JSON.GET", product_id)
    if not raw:
        return None
    return json.loads(raw)


def _get_coupon(code: str) -> dict | None:
    if not code:
        return None
    raw = r.execute_command("JSON.GET", f"coupon:{code.upper()}")
    if not raw:
        return None
    return json.loads(raw)


def add_to_cart(product_id: str, quantity: int, tool_context: ToolContext) -> dict:
    """Add a product to the user's cart.

    Args:
        product_id: Product id, e.g. 'product:01-samsung-a54'.
        quantity: How many units to add. Must be at least 1.
    """
    if quantity <= 0:
        return {"status": "error", "message": "Quantity must be positive"}

    session_id = _session_id(tool_context)
    product = _get_product(product_id)
    if not product:
        return {"status": "error", "message": f"Product {product_id} not found"}

    cart_key = _cart_key(session_id)
    current_qty = int(r.hget(cart_key, product_id) or 0)
    new_qty = current_qty + quantity

    if new_qty > product.get("stock", 0):
        return {
            "status": "out_of_stock",
            "product_id": product_id,
            "product_name": product["name"],
            "available": product.get("stock", 0),
            "requested": new_qty,
        }

    r.hset(cart_key, product_id, new_qty)
    r.expire(cart_key, CART_TTL)

    total_items = sum(int(v) for v in r.hvals(cart_key))
    return {
        "status": "added",
        "product_id": product_id,
        "product_name": product["name"],
        "quantity": new_qty,
        "cart_total_items": total_items,
    }


def remove_from_cart(product_id: str, tool_context: ToolContext) -> dict:
    """Remove a product entirely from the user's cart.

    Args:
        product_id: Product id to remove.
    """
    session_id = _session_id(tool_context)
    cart_key = _cart_key(session_id)
    product = _get_product(product_id)
    name = product["name"] if product else product_id

    removed = r.hdel(cart_key, product_id)
    if not removed:
        return {"status": "not_in_cart", "product_id": product_id, "product_name": name}

    if r.hlen(cart_key) == 0:
        r.delete(cart_key)
        r.delete(_coupon_key(session_id))

    return {"status": "removed", "product_id": product_id, "product_name": name}


def update_quantity(product_id: str, quantity: int, tool_context: ToolContext) -> dict:
    """Set the quantity of a product already in the cart. Quantity 0 removes it."""
    if quantity <= 0:
        return remove_from_cart(product_id, tool_context)

    session_id = _session_id(tool_context)
    product = _get_product(product_id)
    if not product:
        return {"status": "error", "message": f"Product {product_id} not found"}

    if quantity > product.get("stock", 0):
        return {
            "status": "out_of_stock",
            "product_id": product_id,
            "product_name": product["name"],
            "available": product.get("stock", 0),
            "requested": quantity,
        }

    cart_key = _cart_key(session_id)
    r.hset(cart_key, product_id, quantity)
    r.expire(cart_key, CART_TTL)

    return {
        "status": "updated",
        "product_id": product_id,
        "product_name": product["name"],
        "quantity": quantity,
    }


def get_cart(tool_context: ToolContext) -> dict:
    """Return all items in the cart with names, prices and totals."""
    session_id = _session_id(tool_context)
    cart_key = _cart_key(session_id)
    raw = r.hgetall(cart_key)
    if not raw:
        return {"items": [], "subtotal": 0, "item_count": 0}

    items = []
    subtotal = 0
    for product_id, qty in raw.items():
        qty = int(qty)
        product = _get_product(product_id)
        if not product:
            r.hdel(cart_key, product_id)
            continue

        line_total = int(product["price"]) * qty
        subtotal += line_total
        items.append({
            "product_id": product_id,
            "name": product["name"],
            "price": int(product["price"]),
            "quantity": qty,
            "line_total": line_total,
        })

    return {
        "items": items,
        "subtotal": subtotal,
        "item_count": sum(i["quantity"] for i in items),
    }


def clear_cart(tool_context: ToolContext) -> dict:
    """Remove all items from the cart."""
    session_id = _session_id(tool_context)
    r.delete(_cart_key(session_id))
    r.delete(_coupon_key(session_id))
    return {"status": "cart_cleared"}


def apply_coupon(coupon_code: str, tool_context: ToolContext) -> dict:
    """Apply a coupon code to the cart.

    Args:
        coupon_code: e.g. 'SAVE10', 'FLAT500', 'VOICECART'.
    """
    coupon_code = (coupon_code or "").strip().upper()
    if not coupon_code:
        return {"status": "invalid_coupon", "message": "Coupon code is required"}

    coupon = _get_coupon(coupon_code)
    if not coupon:
        return {"status": "invalid_coupon", "code": coupon_code, "message": "Coupon not found"}

    if not coupon.get("active", False):
        return {"status": "inactive_coupon", "code": coupon_code, "message": "Coupon is no longer active"}

    cart = get_cart(tool_context)
    if cart["subtotal"] == 0:
        return {"status": "empty_cart", "message": "Add items to cart before applying a coupon"}

    min_order = int(coupon.get("min_order", 0))
    if cart["subtotal"] < min_order:
        return {
            "status": "min_order_not_met",
            "code": coupon_code,
            "min_order": min_order,
            "subtotal": cart["subtotal"],
        }

    session_id = _session_id(tool_context)
    r.set(_coupon_key(session_id), coupon_code, ex=CART_TTL)

    return {
        "status": "applied",
        "code": coupon_code,
        "type": coupon["type"],
        "value": coupon["value"],
        "description": coupon.get("description"),
    }
