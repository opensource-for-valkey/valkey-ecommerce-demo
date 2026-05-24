import logging
import json
from redis import Redis
from redis.exceptions import ConnectionError
from app.config import VALKEY_URL

logger = logging.getLogger(__name__)

# Initialize Valkey client with decode_responses=True for string results
valkey_client = Redis.from_url(VALKEY_URL, decode_responses=True)

# Atomic inventory check-and-reserve script using Lua
RESERVE_INVENTORY_LUA = """
local current_str = redis.call('JSON.GET', KEYS[1], '$.inventory.quantity')
local reserved_str = redis.call('JSON.GET', KEYS[1], '$.inventory.reserved')
if not current_str then
    return 0
end
local current_arr = cjson.decode(current_str)
local current = tonumber(current_arr[1])
local reserved = 0
if reserved_str then
    local reserved_arr = cjson.decode(reserved_str)
    if reserved_arr and reserved_arr[1] then
        reserved = tonumber(reserved_arr[1])
    end
end
local available = current - reserved
local quantity = tonumber(ARGV[1])
if available >= quantity then
    redis.call('JSON.NUMINCRBY', KEYS[1], '$.inventory.reserved', quantity)
    return 1
end
return 0
"""

# Register Lua script
reserve_inventory_script = valkey_client.register_script(RESERVE_INVENTORY_LUA)

def get_valkey():
    """Dependency injection helper to yield valkey client"""
    return valkey_client

def init_valkey():
    """
    Validates connection to Valkey and seeds mock data.
    Raises ConnectionError if Valkey is unreachable.
    """
    try:
        valkey_client.ping()
        logger.info("Successfully connected to Valkey at %s", VALKEY_URL)
    except ConnectionError as e:
        logger.error("Could not connect to Valkey at %s: %s", VALKEY_URL, str(e))
        raise ConnectionError(f"Failed to connect to Valkey at {VALKEY_URL}. Is Docker running?") from e

    # Seed mock data
    seed_mock_data()

def seed_mock_data():
    """Seeds mock products and coupons if they do not already exist in the database"""
    # 1. Seed Products
    mock_products = {
        "product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f": {
            "id": "product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f",
            "sku": "ELEC-PHN-SAM-001",
            "name": "Galaxy Ultra Pro 256GB",
            "price": {
                "amount": 89999,
                "currency": "INR"
            },
            "inventory": {
                "quantity": 150,
                "reserved": 0,
                "warehouse": "HYD-WH-01"
            },
            "status": "active"
        },
        "product:0192d4e6-3d5f-7b8c-9e0a-1b2c3d4e5f6a": {
            "id": "product:0192d4e6-3d5f-7b8c-9e0a-1b2c3d4e5f6a",
            "sku": "COMP-LAP-ASU-002",
            "name": "Gaming Laptop",
            "price": {
                "amount": 120000,
                "currency": "INR"
            },
            "inventory": {
                "quantity": 10,
                "reserved": 0,
                "warehouse": "HYD-WH-01"
            },
            "status": "active"
        }
    }

    for key, product in mock_products.items():
        if not valkey_client.exists(key):
            valkey_client.json().set(key, "$", product)
            logger.info("Seeded mock product: %s", key)

    # 2. Seed Coupons
    mock_coupons = {
        "coupon:VALKEY10": {
            "code": "VALKEY10",
            "type": "percentage",
            "value": 10,
            "minOrderAmount": 50000,
            "maxDiscount": 10000,
            "validFrom": "2025-05-01T00:00:00Z",
            "validUntil": "2026-12-31T23:59:59Z",
            "usageLimit": 1000,
            "usedCount": 0,
            "applicableCategories": [],
            "active": True
        },
        "coupon:FREESHIP": {
            "code": "FREESHIP",
            "type": "fixed",
            "value": 5000,
            "minOrderAmount": 20000,
            "maxDiscount": 5000,
            "validFrom": "2025-05-01T00:00:00Z",
            "validUntil": "2026-12-31T23:59:59Z",
            "usageLimit": 1000,
            "usedCount": 0,
            "applicableCategories": [],
            "active": True
        }
    }

    for key, coupon in mock_coupons.items():
        if not valkey_client.exists(key):
            valkey_client.json().set(key, "$", coupon)
            logger.info("Seeded mock coupon: %s", key)
