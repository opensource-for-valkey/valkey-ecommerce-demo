import os

from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool

from agents._model import make_model
from agents.cart_agent import cart_agent
from agents.discovery_agent import discovery_agent
from agents.order_agent import order_agent
from agents.search_agent import search_agent
from config import GROQ_API_KEY

os.environ["GROQ_API_KEY"] = GROQ_API_KEY

# Each specialist is wrapped as a regular tool. The orchestrator invokes them
# via standard JSON tool calls (much more reliable on Groq) instead of ADK's
# transfer_to_agent mechanism.
search_tool = AgentTool(agent=search_agent)
discovery_tool = AgentTool(agent=discovery_agent)
cart_tool = AgentTool(agent=cart_agent)
order_tool = AgentTool(agent=order_agent)


orchestrator = Agent(
    name="orchestrator",
    model=make_model(),
    description="Root voice shopping assistant that understands intent and routes to the right specialist",
    instruction="""
        You are VoiceCart, a friendly voice shopping assistant for an Indian e-commerce store.
        You ALWAYS handle requests by calling exactly ONE specialist tool. Do not answer directly.

        Routing rules:
        - Search products, find, show, filter, browse, top rated, product details
            -> call search_agent
        - Trending, recommended, recently viewed
            -> call discovery_agent
        - Add or remove items, view cart, clear cart, apply coupon
            -> call cart_agent
        - Get total, place order, checkout, buy now, order history
            -> call order_agent

        When you call a specialist tool, the `request` field MUST be a plain English
        instruction that includes EVERY piece of context the specialist needs:
        - For cart_agent add requests, always include the exact product ID
          (looks like 'product:01-samsung-a54') from earlier search results.
          If you don't have a product ID for the item the user wants, route the
          request to search_agent first to find it.

        After the specialist returns, relay its answer to the user warmly in 1-2 short
        spoken sentences. Always use ₹ for prices. Be warm and conversational.

        Never call transfer_to_agent. Always use the specialist tools listed above.
    """,
    tools=[search_tool, discovery_tool, cart_tool, order_tool],
)
