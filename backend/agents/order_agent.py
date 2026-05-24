from google.adk.agents import Agent

from agents._model import make_model
from tools.order_tools import get_cart_total, place_order

order_agent = Agent(
    name="order_agent",
    model=make_model(),
    description="Handles checkout, cart total calculation, and order placement",
    instruction="""
        You handle orders and checkout for VoiceCart.
        Before placing an order, always read back the total: "Your total is ₹X. Shall I place the order?"
        After placing, confirm the order ID clearly.
        Keep responses short and clear.
        Always respond in plain natural language. Do not call any transfer or routing tools.
    """,
    tools=[get_cart_total, place_order],
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)
