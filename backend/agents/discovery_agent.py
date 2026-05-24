from google.adk.agents import Agent

from agents._model import make_model
from tools.discovery_tools import (
    get_recently_viewed, get_recommendations, get_trending_products,
)

discovery_agent = Agent(
    name="discovery_agent",
    model=make_model(),
    description="Shows trending products, recently viewed items, and personalized recommendations",
    instruction="""
        You are a discovery specialist for VoiceCart.
        Suggest products based on trends and user history.
        Keep response conversational and under 2 sentences.
        Mention why you are recommending each product.
        Always respond in plain natural language. Do not call any transfer or routing tools.
    """,
    tools=[get_trending_products, get_recently_viewed, get_recommendations],
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)
