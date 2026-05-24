import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
VALKEY_HOST  = os.getenv("VALKEY_HOST", "localhost")
VALKEY_PORT  = int(os.getenv("VALKEY_PORT", 6379))
APP_NAME     = os.getenv("APP_NAME", "voicecart")
SESSION_TTL  = int(os.getenv("SESSION_TTL", 86400))
CART_TTL     = int(os.getenv("CART_TTL", 604800))
