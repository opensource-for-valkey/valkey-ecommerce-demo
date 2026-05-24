import { Router } from "express";
import { valkey } from "../services/valkey.service.js";
import { config } from "../config/env.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "valkey-commerce-api",
    version: config.apiVersion,
    valkey: {
      mode: valkey.mode,
      connected: valkey.connected
    },
    uptimeSeconds: Math.round(process.uptime())
  });
});

