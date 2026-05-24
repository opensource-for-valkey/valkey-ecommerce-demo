// SQLite connection + schema. We keep IDs as TEXT (domain:uuidv7),
// store JSON-shaped fields as TEXT, and let route handlers shape responses
// to match the contracts in HACKATHON.md.

const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, "app.db");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name    TEXT,
  last_name     TEXT,
  role          TEXT NOT NULL DEFAULT 'customer',
  created_at    TEXT NOT NULL,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  last_seen_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS cart_items (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  status      TEXT NOT NULL DEFAULT 'active',
  added_at    TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL,           -- 'user' | 'assistant' | 'tool'
  content      TEXT,                    -- assistant/user text, or tool result JSON
  tool_calls   TEXT,                    -- JSON array (assistant turns that made calls)
  tool_call_id TEXT,                    -- present on role='tool'
  tool_name    TEXT,                    -- present on role='tool' for readability
  created_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_time
  ON chat_messages(user_id, created_at);

CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT,
  parent_id   TEXT REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

CREATE TABLE IF NOT EXISTS vendors (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  email       TEXT,
  phone       TEXT,
  logo        TEXT,
  rating      REAL DEFAULT 0,
  address     TEXT,
  verified    INTEGER NOT NULL DEFAULT 0,
  joined_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id                  TEXT PRIMARY KEY,
  sku                 TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  short_description   TEXT,
  category_id         TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  vendor_id           TEXT NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  brand               TEXT,
  price_amount        INTEGER NOT NULL,
  price_currency      TEXT NOT NULL DEFAULT 'INR',
  price_compare_at    INTEGER,
  attributes          TEXT,
  tags                TEXT,
  images              TEXT,
  inventory_quantity  INTEGER NOT NULL DEFAULT 0,
  inventory_reserved  INTEGER NOT NULL DEFAULT 0,
  inventory_warehouse TEXT,
  ratings_average     REAL NOT NULL DEFAULT 0,
  ratings_count       INTEGER NOT NULL DEFAULT 0,
  status              TEXT NOT NULL DEFAULT 'active',
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_vendor   ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_status   ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_price    ON products(price_amount);
`;

db.exec(SCHEMA);

module.exports = { db, DB_PATH };
