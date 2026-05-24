import os

# Valkey configuration
VALKEY_HOST = os.getenv("VALKEY_HOST", "127.0.0.1")
VALKEY_PORT = int(os.getenv("VALKEY_PORT", 6379))
VALKEY_URL = os.getenv("VALKEY_URL", f"redis://{VALKEY_HOST}:{VALKEY_PORT}/0")

# App server configuration
APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
APP_PORT = int(os.getenv("APP_PORT", 8000))
