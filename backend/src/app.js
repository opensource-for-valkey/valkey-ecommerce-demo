import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import { nanoid } from "nanoid";
import { config } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { sanitizeInput } from "./middleware/sanitize.js";
import { apiRouter } from "./routes/index.js";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(
    cors({
      origin(origin, callback) {
        const isLocalDev =
          config.env !== "production" &&
          /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");

        if (!origin || config.frontendOrigins.includes(origin) || isLocalDev) {
          return callback(null, true);
        }

        return callback(new Error("CORS origin is not allowed"));
      },
      credentials: true
    })
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(mongoSanitize());
  app.use(sanitizeInput);
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim())
      },
      skip: () => config.env === "test"
    })
  );

  app.use((req, res, next) => {
    if (!req.cookies.vc_session) {
      res.cookie("vc_session", `guest-${nanoid(12)}`, {
        httpOnly: true,
        sameSite: "lax",
        secure: config.env === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30
      });
    }
    next();
  });

  app.use(rateLimit);
  app.use(`/api/${config.apiVersion}`, apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
