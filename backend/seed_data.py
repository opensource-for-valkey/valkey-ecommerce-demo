import json
import sys
import struct
import numpy as np
import bcrypt
from sentence_transformers import SentenceTransformer
from valkey_client import r

PRODUCTS = [
    {
        "id": "product:01-samsung-a54",
        "name": "Samsung Galaxy A54",
        "brand": "Samsung",
        "category": "smartphones",
        "price": 38999,
        "description": "6.4 inch AMOLED display, 50MP camera, 5000mAh battery, Android 14",
        "rating": 4.5,
        "stock": 50,
        "image": "/assets/products/samsung-a54.jpg"
    },
    {
        "id": "product:02-iphone-15",
        "name": "Apple iPhone 15",
        "brand": "Apple",
        "category": "smartphones",
        "price": 79999,
        "description": "6.1 inch Super Retina XDR display, A16 Bionic chip, 48MP camera",
        "rating": 4.8,
        "stock": 30,
        "image": "/assets/products/iphone-15.jpg"
    },
    {
        "id": "product:03-sony-wh1000",
        "name": "Sony WH-1000XM5",
        "brand": "Sony",
        "category": "headphones",
        "price": 29999,
        "description": "Industry leading noise cancellation wireless headphones, 30hr battery",
        "rating": 4.7,
        "stock": 40,
        "image": "/assets/products/sony-wh1000.jpg"
    },
    {
        "id": "product:04-nike-airmax",
        "name": "Nike Air Max 270",
        "brand": "Nike",
        "category": "shoes",
        "price": 12999,
        "description": "Max Air cushioning running shoes with breathable mesh upper",
        "rating": 4.4,
        "stock": 60,
        "image": "/assets/products/nike-airmax.jpg"
    },
    {
        "id": "product:05-samsung-tv",
        "name": "Samsung 55 inch 4K TV",
        "brand": "Samsung",
        "category": "televisions",
        "price": 54999,
        "description": "Crystal 4K UHD television with HDR, built-in Alexa, 3 HDMI ports",
        "rating": 4.6,
        "stock": 20,
        "image": "/assets/products/samsung-tv.jpg"
    },
    {
        "id": "product:06-apple-airpods",
        "name": "Apple AirPods Pro 2",
        "brand": "Apple",
        "category": "headphones",
        "price": 24999,
        "description": "Active noise cancellation earbuds with transparency mode and adaptive audio",
        "rating": 4.9,
        "stock": 45,
        "image": "/assets/products/airpods-pro.jpg"
    },
    {
        "id": "product:07-oneplus-12",
        "name": "OnePlus 12",
        "brand": "OnePlus",
        "category": "smartphones",
        "price": 64999,
        "description": "Snapdragon 8 Gen 3 flagship phone with 50MP Hasselblad camera and 100W charging",
        "rating": 4.6,
        "stock": 35,
        "image": "/assets/products/oneplus-12.jpg"
    },
    {
        "id": "product:08-lg-monitor",
        "name": "LG 27 inch 4K Monitor",
        "brand": "LG",
        "category": "monitors",
        "price": 32999,
        "description": "IPS panel 4K display with HDR400 and USB-C connectivity for work and gaming",
        "rating": 4.5,
        "stock": 25,
        "image": "/assets/products/lg-monitor.jpg"
    },
    {
        "id": "product:09-samsung-s24",
        "name": "Samsung Galaxy S24 Ultra",
        "brand": "Samsung",
        "category": "smartphones",
        "price": 129999,
        "description": "200MP camera smartphone with built-in S Pen and Snapdragon 8 Gen 3",
        "rating": 4.8,
        "stock": 20,
        "image": "/assets/products/samsung-s24.jpg"
    },
    {
        "id": "product:10-boat-rockerz",
        "name": "boAt Rockerz 550",
        "brand": "boAt",
        "category": "headphones",
        "price": 1999,
        "description": "Affordable over-ear wireless headphones with 40hr battery and foldable design",
        "rating": 4.2,
        "stock": 100,
        "image": "/assets/products/boat-rockerz.jpg"
    },
    {
        "id": "product:11-adidas-ultraboost",
        "name": "Adidas Ultraboost 23",
        "brand": "Adidas",
        "category": "shoes",
        "price": 17999,
        "description": "Premium running shoes with Boost midsole cushioning and Primeknit upper",
        "rating": 4.6,
        "stock": 40,
        "image": "/assets/products/adidas-ultraboost.jpg"
    },
    {
        "id": "product:12-mi-tv",
        "name": "Mi 43 inch Full HD TV",
        "brand": "Xiaomi",
        "category": "televisions",
        "price": 26999,
        "description": "Full HD smart television with Android TV 11, Chromecast and Dolby Audio",
        "rating": 4.3,
        "stock": 30,
        "image": "/assets/products/mi-tv.jpg"
    }
]

COUPONS = [
    {
        "code": "SAVE10",
        "type": "percentage",
        "value": 10,
        "active": True,
        "min_order": 5000,
        "description": "10% off on orders above ₹5000"
    },
    {
        "code": "FLAT500",
        "type": "fixed",
        "value": 500,
        "active": True,
        "min_order": 2000,
        "description": "Flat ₹500 off on orders above ₹2000"
    },
    {
        "code": "VOICECART",
        "type": "percentage",
        "value": 15,
        "active": True,
        "min_order": 10000,
        "description": "15% off for VoiceCart users on orders above ₹10000"
    }
]

EMBEDDING_DIM = 384


def generate_embeddings(products):
    print("Loading sentence-transformers model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("Model loaded.")

    texts = [f"{p['name']} {p['brand']} {p['category']} {p['description']}" for p in products]
    embeddings = model.encode(texts, normalize_embeddings=True)
    print(f"Generated {len(embeddings)} embeddings (dim={EMBEDDING_DIM}).")
    return embeddings


def create_search_index():
    try:
        r.execute_command("FT.DROPINDEX", "idx:products")
        print("Dropped existing index.")
    except Exception:
        pass

    r.execute_command(
        "FT.CREATE", "idx:products",
        "ON", "JSON",
        "PREFIX", "1", "product:",
        "SCHEMA",
        "$.brand",     "AS", "brand",     "TAG",
        "$.category",  "AS", "category",  "TAG",
        "$.price",     "AS", "price",     "NUMERIC",
        "$.rating",    "AS", "rating",    "NUMERIC",
        "$.embedding", "AS", "embedding", "VECTOR", "HNSW", "6",
            "TYPE", "FLOAT32",
            "DIM",  str(EMBEDDING_DIM),
            "DISTANCE_METRIC", "COSINE",
    )
    print("Search index created: idx:products")


def seed_products(embeddings):
    for i, product in enumerate(PRODUCTS):
        embedding_list = embeddings[i].astype(np.float32).tolist()
        product_with_embedding = {**product, "embedding": embedding_list}

        r.execute_command("JSON.SET", product["id"], "$", json.dumps(product_with_embedding))

        r.sadd(f"brand:{product['brand'].lower()}", product["id"])
        r.sadd(f"category:{product['category']}", product["id"])
        r.zadd("price_index", {product["id"]: product["price"]})
        r.zadd("trending:global", {product["id"]: 0})

    print(f"Seeded {len(PRODUCTS)} products with embeddings.")


def seed_coupons():
    for coupon in COUPONS:
        r.execute_command("JSON.SET", f"coupon:{coupon['code']}", "$", json.dumps(coupon))
    print(f"Seeded {len(COUPONS)} coupons: {[c['code'] for c in COUPONS]}")


USERS = [
    {
        "id": "user:01-priya-sharma",
        "email": "priya.sharma@example.com",
        "password": "Password@123",
        "firstName": "Priya",
        "lastName": "Sharma",
        "phone": "+91-9876543210",
        "avatar": "/assets/avatars/priya.jpg",
        "role": "customer",
        "addresses": [
            {
                "id": "addr:01",
                "label": "Home",
                "street": "42 MG Road, Banjara Hills",
                "city": "Hyderabad",
                "state": "Telangana",
                "postalCode": "500034",
                "country": "IN",
                "isDefault": True
            }
        ],
        "preferences": {
            "currency": "INR",
            "language": "en",
            "notifications": True
        }
    },
    {
        "id": "user:02-rahul-verma",
        "email": "rahul.verma@example.com",
        "password": "Password@123",
        "firstName": "Rahul",
        "lastName": "Verma",
        "phone": "+91-9123456789",
        "avatar": "/assets/avatars/rahul.jpg",
        "role": "customer",
        "addresses": [
            {
                "id": "addr:02",
                "label": "Home",
                "street": "15 Park Street",
                "city": "Mumbai",
                "state": "Maharashtra",
                "postalCode": "400001",
                "country": "IN",
                "isDefault": True
            }
        ],
        "preferences": {
            "currency": "INR",
            "language": "en",
            "notifications": False
        }
    },
    {
        "id": "user:03-anjali-singh",
        "email": "anjali.singh@example.com",
        "password": "Password@123",
        "firstName": "Anjali",
        "lastName": "Singh",
        "phone": "+91-9988776655",
        "avatar": "/assets/avatars/anjali.jpg",
        "role": "customer",
        "addresses": [
            {
                "id": "addr:03",
                "label": "Home",
                "street": "8 Connaught Place",
                "city": "New Delhi",
                "state": "Delhi",
                "postalCode": "110001",
                "country": "IN",
                "isDefault": True
            }
        ],
        "preferences": {
            "currency": "INR",
            "language": "en",
            "notifications": True
        }
    },
    {
        "id": "user:04-admin",
        "email": "admin@voicecart.com",
        "password": "Admin@123",
        "firstName": "Admin",
        "lastName": "VoiceCart",
        "phone": "+91-9000000000",
        "avatar": "/assets/avatars/admin.jpg",
        "role": "admin",
        "addresses": [],
        "preferences": {
            "currency": "INR",
            "language": "en",
            "notifications": True
        }
    }
]


def seed_users():
    for user in USERS:
        plain_password = user.pop("password")
        password_hash = bcrypt.hashpw(
            plain_password.encode("utf-8"),
            bcrypt.gensalt(rounds=12)
        ).decode("utf-8")

        user_doc = {
            **user,
            "passwordHash": password_hash,
            "createdAt": "2025-01-15T10:30:00Z",
            "lastLoginAt": None
        }

        # Store user JSON document
        r.execute_command("JSON.SET", user["id"], "$", json.dumps(user_doc))

        # Email → userId index for fast login lookup
        r.set(f"email:{user['email']}", user["id"])

    print(f"Seeded {len(USERS)} users.")
    print(f"  Login credentials (all passwords: Password@123):")
    for u in USERS:
        print(f"    {u['email']}  ({u['role']})")


def verify():
    info = r.execute_command("FT.INFO", "idx:products")
    info_dict = dict(zip(info[::2], info[1::2]))
    num_docs = info_dict.get("num_docs", "unknown")
    print(f"Index verified: {num_docs} products indexed.")


if __name__ == "__main__":
    print("Connecting to Valkey...")
    if not r.ping():
        print("ERROR: Cannot connect to Valkey. Is Docker running?")
        sys.exit(1)
    print("Connected.\n")

    embeddings = generate_embeddings(PRODUCTS)
    create_search_index()
    seed_products(embeddings)
    seed_coupons()
    seed_users()
    verify()
    print("\nValkey is ready. Foundation complete.")
