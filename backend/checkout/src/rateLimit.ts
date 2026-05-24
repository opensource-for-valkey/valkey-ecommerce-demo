import type { NextFunction, Request, Response } from "express";
import type { Redis } from "ioredis";
import { errorBody } from "./errors";

interface RateLimitRule {
  anonymous: number;
  authenticated: number;
  window: number;
}

export const RATE_LIMIT_CONFIG: Record<string, RateLimitRule> = {
  "/api/search": { anonymous: 20, authenticated: 60, window: 60 },
  "/api/search/semantic": { anonymous: 20, authenticated: 60, window: 60 },
  "/api/checkout/start": { anonymous: 0, authenticated: 5, window: 60 },
  "/api/auth/login": { anonymous: 5, authenticated: 5, window: 900 },
  "/api/products": { anonymous: 30, authenticated: 100, window: 60 },
  "/api/cart": { anonymous: 10, authenticated: 30, window: 60 },
  "/api/ratelimit/test": { anonymous: 3, authenticated: 6, window: 60 },
  default: { anonymous: 60, authenticated: 120, window: 60 },
};

export function rateLimitMiddleware(client: Redis) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const endpoint = endpointGroup(request.path);
      const rule = RATE_LIMIT_CONFIG[endpoint] ?? RATE_LIMIT_CONFIG.default;
      const identity = identify(request);
      const limit = identity.authenticated ? rule.authenticated : rule.anonymous;
      const now = Date.now();
      const windowMs = rule.window * 1000;
      const reset = Math.ceil((now + windowMs) / 1000);

      response.setHeader("X-RateLimit-Limit", String(limit));
      response.setHeader("X-RateLimit-Reset", String(reset));

      if (limit <= 0) {
        response.setHeader("X-RateLimit-Remaining", "0");
        response.setHeader("Retry-After", String(rule.window));
        response.status(429).json(errorBody("rate_limit_exceeded", "This endpoint requires authentication.", { limit, window: rule.window }));
        return;
      }

      const key = `ratelimit:sliding:${identity.id}:${endpoint}`;
      const transaction = await client
        .multi()
        .zremrangebyscore(key, 0, now - windowMs)
        .zcard(key)
        .exec();
      const count = Number(transaction?.[1]?.[1] ?? 0);

      if (count >= limit) {
        response.setHeader("X-RateLimit-Remaining", "0");
        response.setHeader("Retry-After", String(rule.window));
        response.status(429).json(errorBody("rate_limit_exceeded", `Too many requests. Try again in ${rule.window} seconds.`, { limit, window: rule.window }));
        return;
      }

      await client
        .multi()
        .zadd(key, now, `${now}:${Math.random().toString(36).slice(2)}`)
        .expire(key, rule.window)
        .exec();

      response.setHeader("X-RateLimit-Remaining", String(limit - count - 1));
      next();
    } catch {
      next();
    }
  };
}

export function endpointGroup(path: string): string {
  if (path === "/api/ratelimit/test") return path;
  if (path === "/api/search/semantic") return path;
  if (path.startsWith("/api/search")) return "/api/search";
  if (path.startsWith("/api/products")) return "/api/products";
  if (path.startsWith("/api/cart")) return "/api/cart";
  if (path.startsWith("/api/checkout/start")) return "/api/checkout/start";
  if (path.startsWith("/api/auth/login")) return "/api/auth/login";
  return "default";
}

function identify(request: Request): { id: string; authenticated: boolean } {
  const userId = request.header("X-User-Id");
  if (userId) return { id: userId, authenticated: true };
  const authorization = request.header("Authorization");
  if (authorization) return { id: `session:${authorization.slice(-32)}`, authenticated: true };
  const guest = request.header("X-Guest-Session-Id");
  if (guest) return { id: guest, authenticated: false };
  return { id: `ip:${request.ip ?? request.socket.remoteAddress ?? "unknown"}`, authenticated: false };
}
