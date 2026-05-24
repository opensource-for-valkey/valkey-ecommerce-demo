import json

import numpy as np
from sentence_transformers import SentenceTransformer
from valkey_client import r, r_binary

# Load model once at startup — reused for every search query
_model = None

def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

def _query_to_bytes(text: str) -> bytes:
    model = _get_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return np.array(embedding, dtype=np.float32).tobytes()

def _fetch_by_ids(product_ids: list) -> dict:
    products = []
    for pid in product_ids:
        data = r.execute_command("JSON.GET", pid)
        if data:
            product = json.loads(data)
            product.pop("embedding", None)
            products.append(product)
    return {"products": products, "count": len(products)}

def _parse_knn_results(raw) -> dict:
    products = []
    if not raw or raw[0] == 0:
        return {"products": [], "count": 0}
    i = 1
    while i < len(raw):
        fields = raw[i + 1]  # list of [field, value, field, value ...]
        # Build a dict from the flat field list
        field_dict = {}
        for j in range(0, len(fields) - 1, 2):
            k = fields[j].decode("utf-8") if isinstance(fields[j], bytes) else fields[j]
            v = fields[j + 1].decode("utf-8") if isinstance(fields[j + 1], bytes) else fields[j + 1]
            field_dict[k] = v

        # $ field contains the full JSON document
        if "$" in field_dict:
            product = json.loads(field_dict["$"])
            product.pop("embedding", None)
            if "score" in field_dict:
                product["similarity_score"] = round(1 - float(field_dict["score"]), 4)
            products.append(product)
        i += 2
    return {"products": products, "count": len(products)}


def search_products(query: str = "", brand: str = "", category: str = "",
                    min_price: int = -1, max_price: int = -1) -> dict:
    """Search products by semantic query, brand, category, or price range.

    Args:
        query: Natural language search e.g. 'wireless headphones with long battery'.
            Pass an empty string when not searching by keyword.
        brand: Brand name e.g. 'Samsung', 'Apple', 'Sony', 'Nike', 'boAt'.
            Pass an empty string when not filtering by brand.
        category: Category e.g. 'smartphones', 'headphones', 'shoes', 'televisions', 'monitors'.
            Pass an empty string when not filtering by category.
        min_price: Minimum price in rupees. Pass -1 for no lower bound.
        max_price: Maximum price in rupees. Pass -1 for no upper bound.

    Returns:
        List of matching products with name, brand, price, rating
    """
    try:
        # Normalize sentinel defaults to None for internal logic
        query = query.strip() if query else ""
        brand = brand.strip() if brand else ""
        category = category.strip() if category else ""
        min_price_val = min_price if isinstance(min_price, int) and min_price >= 0 else None
        max_price_val = max_price if isinstance(max_price, int) and max_price >= 0 else None

        # Build filter parts for TAG and NUMERIC fields
        filters = []
        if brand:
            filters.append(f"@brand:{{{brand}}}")
        if category:
            filters.append(f"@category:{{{category}}}")
        if min_price_val is not None and max_price_val is not None:
            filters.append(f"@price:[{min_price_val} {max_price_val}]")
        elif max_price_val is not None:
            filters.append(f"@price:[0 {max_price_val}]")
        elif min_price_val is not None:
            filters.append(f"@price:[{min_price_val} +inf]")

        filter_str = " ".join(filters)

        if query:
            # Semantic KNN vector search — with or without filters
            vec_bytes = _query_to_bytes(query)

            if filter_str:
                knn_query = f"({filter_str})=>[KNN 8 @embedding $vec AS score]"
            else:
                knn_query = f"*=>[KNN 8 @embedding $vec AS score]"

            raw = r_binary.execute_command(
                "FT.SEARCH", "idx:products", knn_query,
                "PARAMS", "2", "vec", vec_bytes,
                "DIALECT", "2"
            )
            return _parse_knn_results(raw)

        else:
            # Filter-only — use pre-built index sets for speed
            if brand and not category and min_price_val is None and max_price_val is None:
                ids = list(r.smembers(f"brand:{brand.lower()}"))
                return _fetch_by_ids(ids)

            if category and not brand and min_price_val is None and max_price_val is None:
                ids = list(r.smembers(f"category:{category.lower()}"))
                return _fetch_by_ids(ids)

            # Price range or combined — scan price_index sorted set
            lo = min_price_val if min_price_val is not None else "-inf"
            hi = max_price_val if max_price_val is not None else "+inf"
            ids = r.zrangebyscore("price_index", lo, hi)

            if brand:
                brand_ids = r.smembers(f"brand:{brand.lower()}")
                ids = [i for i in ids if i in brand_ids]
            if category:
                cat_ids = r.smembers(f"category:{category.lower()}")
                ids = [i for i in ids if i in cat_ids]

            return _fetch_by_ids(ids)

    except Exception as e:
        return {"products": [], "count": 0, "error": str(e)}


def get_product_details(product_id: str) -> dict:
    """Get full details of a specific product by its ID.

    Args:
        product_id: Product ID e.g. 'product:01-samsung-a54'

    Returns:
        Full product details including price, rating, stock, description
    """
    try:
        data = r.execute_command("JSON.GET", product_id)
        if not data:
            return {"error": f"Product '{product_id}' not found"}
        product = json.loads(data)
        product.pop("embedding", None)
        return product
    except Exception as e:
        return {"error": str(e)}


def get_top_rated_products() -> dict:
    """Get the top 5 highest rated products in the store.

    Returns:
        Top products sorted by customer rating
    """
    try:
        # Use price_index to get all IDs, then sort by rating in Python
        all_ids = r.zrange("price_index", 0, -1)
        products = []
        for pid in all_ids:
            data = r.execute_command("JSON.GET", pid)
            if data:
                p = json.loads(data)
                p.pop("embedding", None)
                products.append(p)

        products.sort(key=lambda x: x.get("rating", 0), reverse=True)
        top = products[:5]
        return {"products": top, "count": len(top)}
    except Exception as e:
        return {"products": [], "count": 0, "error": str(e)}
