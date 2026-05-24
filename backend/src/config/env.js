import dotenv from "dotenv";

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};

export const config = {
  env: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 4000),
  apiVersion: process.env.API_VERSION || "v1",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  frontendOrigins: (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret:
    process.env.JWT_SECRET ||
    "development-only-change-this-secret-before-production-use",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  valkeyUrl: process.env.VALKEY_URL || "redis://localhost:6379",
  valkeyRequired: toBoolean(process.env.VALKEY_REQUIRED, false),
  rateLimit: {
    windowSeconds: toNumber(process.env.RATE_LIMIT_WINDOW_SECONDS, 60),
    max: toNumber(process.env.RATE_LIMIT_MAX, 120)
  },
  demoAdmin: {
    email: process.env.DEMO_ADMIN_EMAIL || "admin@valkeycommerce.dev",
    password: process.env.DEMO_ADMIN_PASSWORD || "Admin123!"
  }
};

if (config.env === "production" && config.jwtSecret.includes("development-only")) {
  throw new Error("JWT_SECRET must be set to a strong secret in production.");
}
