import redis
from config import VALKEY_HOST, VALKEY_PORT

# Standard client — strings decoded automatically (used everywhere)
r = redis.Redis(host=VALKEY_HOST, port=VALKEY_PORT, decode_responses=True)

# Binary client — needed for KNN vector search (vectors are raw bytes)
r_binary = redis.Redis(host=VALKEY_HOST, port=VALKEY_PORT, decode_responses=False)

def ping() -> bool:
    try:
        return r.ping()
    except Exception:
        return False
