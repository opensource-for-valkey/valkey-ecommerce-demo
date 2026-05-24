import json
from groq import Groq
from config import GROQ_API_KEY
from valkey_client import r
from config import SESSION_TTL

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are VoiceCart, a friendly voice shopping assistant for an Indian e-commerce store.

Your ONLY job is to understand the user's intent and delegate to the right specialist agent.
You do NOT access products, cart, or order data yourself — you always delegate.

Routing rules (pick exactly one):
- Search products, find, show, filter, browse, details, top rated   → delegate_to_search_agent
- Trending, recommended, recently viewed, discovery                  → delegate_to_discovery_agent
- Add/remove/view/clear cart, apply coupon                          → delegate_to_cart_agent
- Get total, place order, checkout, buy now                         → delegate_to_order_agent

After the specialist responds, relay the result warmly in 1-2 short sentences (spoken aloud).
Always use ₹ for prices. Be warm and conversational."""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "delegate_to_search_agent",
            "description": "Route to search agent for: searching products by keyword/brand/category/price, getting product details, top rated products",
            "parameters": {
                "type": "object",
                "properties": {
                    "task": {"type": "string", "description": "The user's full request, including any context needed (e.g. product names from previous results)"}
                },
                "required": ["task"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delegate_to_discovery_agent",
            "description": "Route to discovery agent for: trending products, recently viewed items, personalized recommendations",
            "parameters": {
                "type": "object",
                "properties": {
                    "task": {"type": "string", "description": "The user's full request"}
                },
                "required": ["task"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delegate_to_cart_agent",
            "description": "Route to cart agent for: add to cart, remove from cart, view cart contents, clear cart, apply coupon code",
            "parameters": {
                "type": "object",
                "properties": {
                    "task": {"type": "string", "description": "The user's full request. If user said 'add that one' include the product details from prior context."}
                },
                "required": ["task"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delegate_to_order_agent",
            "description": "Route to order agent for: get cart total with discounts, place order, checkout",
            "parameters": {
                "type": "object",
                "properties": {
                    "task": {"type": "string", "description": "The user's full request"}
                },
                "required": ["task"]
            }
        }
    }
]


def _run_tool(tool_name: str, tool_args: dict, session_id: str) -> str:
    task = tool_args.get("task", "")
    try:
        if tool_name == "delegate_to_search_agent":
            from agents.search_agent import run as search_run
            return search_run(task=task, session_id=session_id)

        elif tool_name == "delegate_to_discovery_agent":
            from agents.discovery_agent import run as discovery_run
            return discovery_run(task=task, session_id=session_id)

        elif tool_name == "delegate_to_cart_agent":
            from agents.cart_agent import run as cart_run
            return cart_run(task=task, session_id=session_id)

        elif tool_name == "delegate_to_order_agent":
            from agents.order_agent import run as order_run
            return order_run(task=task, session_id=session_id)

        return f"Unknown agent: {tool_name}"

    except Exception as e:
        return f"Error from {tool_name}: {str(e)}"


def get_conversation_history(session_id: str) -> list:
    data = r.get(f"conversation:{session_id}")
    if data:
        return json.loads(data)
    return []


def save_conversation_history(session_id: str, history: list):
    r.set(f"conversation:{session_id}", json.dumps(history), ex=SESSION_TTL)


def run_agent(message: str, session_id: str) -> dict:
    history = get_conversation_history(session_id)
    history.append({"role": "user", "content": message})

    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history

    while True:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            max_tokens=512,
            temperature=0.3,
        )

        choice = response.choices[0]

        if not choice.message.tool_calls:
            final_text = choice.message.content
            history.append({"role": "assistant", "content": final_text})
            save_conversation_history(session_id, history)
            return {"response": final_text, "session_id": session_id}

        messages.append(choice.message)

        for tool_call in choice.message.tool_calls:
            result = _run_tool(
                tool_call.function.name,
                json.loads(tool_call.function.arguments),
                session_id
            )
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result
            })
