import type { NextFunction, Request, Response } from "express";
import { getValkey } from "./client";
import { keys } from "./keys";

export const valkeyRateLimit = (scope: string, max: number, windowSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identity = req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
    const key = keys.rate(scope, identity);
    const client = await getValkey();
    const count = await client.incr(key);
    if (count === 1) await client.expire(key, windowSeconds);
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - count));
    if (count > max) {
      res.status(429).json({ error: "Rate limit exceeded", scope });
      return;
    }
    next();
  };
};
