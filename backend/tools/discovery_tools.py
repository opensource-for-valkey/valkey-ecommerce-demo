import json
from valkey_client import r

HISTORY_MAX   = 20   # max products stored per session history
HISTORY_TTL   = 3600 # 1 hour session history expiry
TRENDING_KEYS = [
    "trending:global",
    "trending:1h",
    "trending:24h",
]


def track_product_view(session_id: str, product_id: str) -> dict:
    """Track that a user viewed a product. Call this on every product view.

    Args:
        session_id: Current user session ID
        product_id: Product ID that was viewed

    Returns:
        Confirmation of tracking
    """
    try:
        # Add to session history (newest first, capped at HISTORY_MAX)
        r.lpush(f"user_history:{session_id}", product_id)
        r.ltrim(f"user_history:{session_id}", 0, HISTORY_MAX - 1)
        r.expire(f"user_history:{session_id}", HISTORY_TTL)

        # Increment trending score — views count as 1 point
        r.zincrby("trending:global", 1, product_id)
        r.zincrby("trending:1h",     1, product_id)
        r.zincrby("trending:24h",    1, product_id)

        # Set TTL on time-windowed trending keys
        r.expire("trending:1h",  3600)
        r.expire("trending:24h", 86400)

        return {"status": "tracked", "product_id": product_id}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def track_add_to_cart(session_id: str, product_id: str) -> dict:
    """Track that a user added a product to cart (3 trending points).

    Args:
        session_id: Current user session ID
        product_id: Product ID added to cart

    Returns:
        Confirmation
    """
    try:
        r.zincrby("trending:global", 3, product_id)
        r.zincrby("trending:1h",     3, product_id)
        r.zincrby("trending:24h",    3, product_id)
        return {"status": "tracked"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def track_purchase(product_id: str) -> dict:
    """Track a product purchase (5 trending points).

    Args:
        product_id: Product ID that was purchased

    Returns:
        Confirmation
    """
    try:
        r.zincrby("trending:global", 5, product_id)
        r.zincrby("trending:1h",     5, product_id)
        r.zincrby("trending:24h",    5, product_id)
        return {"status": "tracked"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def get_trending_products(window: str = "global") -> dict:
    """Get the most trending products right now.

    Args:
        window: Time window — 'global' for all-time, '1h' for last hour, '24h' for last 24 hours

    Returns:
        Top 5 trending products with their trend scores
    """
    try:
        key = f"trending:{window}" if window in ("1h", "24h") else "trending:global"
        results = r.zrevrange(key, 0, 4, withscores=True)

        if not results:
            return {"products": [], "count": 0}

        products = []
        for product_id, score in results:
            data = r.execute_command("JSON.GET", product_id)
            if data:
                product = json.loads(data)
                product.pop("embedding", None)
                product["trend_score"] = int(score)
                products.append(product)

        return {"products": products, "count": len(products), "window": window}
    except Exception as e:
        return {"products": [], "count": 0, "error": str(e)}


def get_recently_viewed(session_id: str) -> dict:
    """Get products the user recently viewed in this session.

    Args:
        session_id: Current user session ID

    Returns:
        Last 5 products viewed, newest first
    """
    try:
        product_ids = r.lrange(f"user_history:{session_id}", 0, 4)

        if not product_ids:
            return {"products": [], "count": 0, "message": "No recently viewed products"}

        # Deduplicate while preserving order
        seen = set()
        unique_ids = []
        for pid in product_ids:
            if pid not in seen:
                seen.add(pid)
                unique_ids.append(pid)

        products = []
        for pid in unique_ids:
            data = r.execute_command("JSON.GET", pid)
            if data:
                product = json.loads(data)
                product.pop("embedding", None)
                products.append(product)

        return {"products": products, "count": len(products)}
    except Exception as e:
        return {"products": [], "count": 0, "error": str(e)}


def get_recommendations(session_id: str) -> dict:
    """Get personalized product recommendations based on browsing history and trending.

    Args:
        session_id: Current user session ID

    Returns:
        Recommended products blending trending + user history categories
    """
    try:
        # Get user's recently viewed product IDs
        history_ids = set(r.lrange(f"user_history:{session_id}", 0, 19))

        # Get trending product IDs
        trending_raw = r.zrevrange("trending:global", 0, 9, withscores=True)
        trending_ids = [pid for pid, _ in trending_raw]

        # Find categories from user history
        preferred_categories = {}
        for pid in history_ids:
            data = r.execute_command("JSON.GET", pid, "$.category")
            if data:
                cats = json.loads(data)
                for cat in cats:
                    preferred_categories[cat] = preferred_categories.get(cat, 0) + 1

        # Get products from preferred categories (excluding already viewed)
        category_products = []
        for cat in sorted(preferred_categories, key=preferred_categories.get, reverse=True)[:2]:
            cat_ids = r.smembers(f"category:{cat}")
            for pid in cat_ids:
                if pid not in history_ids:
                    category_products.append(pid)

        # Blend: trending (not viewed) + category affinity
        recommended_ids = []
        for pid in trending_ids:
            if pid not in history_ids and pid not in recommended_ids:
                recommended_ids.append(pid)
        for pid in category_products:
            if pid not in recommended_ids:
                recommended_ids.append(pid)

        # Fetch top 6 recommended
        products = []
        for pid in recommended_ids[:6]:
            data = r.execute_command("JSON.GET", pid)
            if data:
                product = json.loads(data)
                product.pop("embedding", None)
                products.append(product)

        return {"products": products, "count": len(products)}
    except Exception as e:
        return {"products": [], "count": 0, "error": str(e)}
