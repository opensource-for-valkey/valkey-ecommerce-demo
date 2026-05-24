import { config } from "../config/env.js";
import { valkey } from "../services/valkey.service.js";

export const rateLimit = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "local";
    const key = `rate:${ip}:${Math.floor(Date.now() / (config.rateLimit.windowSeconds * 1000))}`;
    const count = await valkey.incrementWithExpire(key, config.rateLimit.windowSeconds);

    res.setHeader("X-RateLimit-Limit", String(config.rateLimit.max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(config.rateLimit.max - count, 0)));

    if (count > config.rateLimit.max) {
      return res.status(429).json({
        error: {
          message: "Too many requests. Please try again shortly.",
          status: 429
        }
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

