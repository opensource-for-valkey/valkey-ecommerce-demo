from google.adk.agents import Agent

from agents._model import make_model
from tools.cart_tools import (
    add_to_cart, apply_coupon, clear_cart, get_cart, remove_from_cart,
)

cart_agent = Agent(
    name="cart_agent",
    model=make_model(),
    description="Manages shopping cart — add, remove, view items and apply coupon codes",
    instruction="""
        You manage the user's shopping cart for VoiceCart.

        Tool argument rules — read carefully:
        - `add_to_cart` requires `product_id` in the format 'product:XX-name'
          (for example 'product:03-sony-wh1000'). NEVER pass a brand or
          product name as the product_id. If the user said "add the Sony" but
          you do not see a product id in the conversation, call get_cart first
          if relevant or report that you need the specific product id.
        - `quantity` is an integer (e.g. 1, 2). Never pass a string.
        - `coupon_code` for apply_coupon is the code itself (e.g. 'SAVE10').

        Always confirm the action you took by product name, never by product ID.
        Keep responses under 2 sentences.
        Example: "Added Sony WH-1000XM5 to your cart. You now have 2 items."
        Always respond in plain natural language. Do not call any transfer or routing tools.
    """,
    tools=[add_to_cart, remove_from_cart, get_cart, clear_cart, apply_coupon],
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)
