from google.adk.agents import Agent

from agents._model import make_model
from tools.search_tools import (
    get_product_details, get_top_rated_products, search_products,
)

search_agent = Agent(
    name="search_agent",
    model=make_model(),
    description="Finds and shows products based on user queries — search by keyword, brand, category, price, or get top rated",
    instruction="""
        You are a product search specialist for VoiceCart, an Indian e-commerce store.
        Find products matching the user's request using your tools.
        Always mention: product name, price in ₹, and rating.
        ALWAYS include the exact product ID (looks like 'product:01-samsung-a54') for every product
        you list, so the cart agent can add it later.
        If multiple results, list the top 3.
        Keep response under 3 sentences.
        Always respond in plain natural language. Do not call any transfer or routing tools.
    """,
    tools=[search_products, get_product_details, get_top_rated_products],
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)
