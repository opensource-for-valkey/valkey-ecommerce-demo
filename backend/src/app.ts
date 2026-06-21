import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import client from "prom-client";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import adminRoutes from "./modules/admin/admin.routes";
import aiRoutes from "./modules/ai/ai.routes";
import authRoutes from "./modules/auth/auth.routes";
import cartRoutes from "./modules/cart/cart.routes";
import catalogRoutes from "./modules/catalog/catalog.routes";
import checkoutRoutes from "./modules/checkout/checkout.routes";
import realtimeRoutes from "./modules/realtime/realtime.routes";
import { openApiDocument } from "./docs/openapi";
import { AppError } from "./utils/errors";

client.collectDefaultMetrics({ prefix: "shopmind_" });
const httpRequests = new client.Counter({
  name: "shopmind_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"]
});

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true
    })
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use((req, res, next) => {
    res.on("finish", () => httpRequests.inc({ method: req.method, route: req.route?.path ?? req.path, status: res.statusCode }));
    next();
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "shopmind-ai", time: new Date().toISOString() });
  });
  app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  });
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.get("/api/openapi.json", (_req, res) => res.json(openApiDocument));

  app.use("/api/auth", authRoutes);
  app.use("/api", catalogRoutes);
  app.use("/api", aiRoutes);
  app.use("/api", cartRoutes);
  app.use("/api", checkoutRoutes);
  app.use("/api", realtimeRoutes);
  app.use("/api", adminRoutes);

  app.use((_req, _res, next) => next(new AppError(404, "Route not found")));
  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const appError = error as AppError;
    const statusCode = appError.statusCode ?? 500;
    if (statusCode >= 500) console.error(error);
    res.status(statusCode).json({
      error: error.name === "ZodError" ? "Validation failed" : error.message,
      details: appError.details
    });
  });

  return app;
};
