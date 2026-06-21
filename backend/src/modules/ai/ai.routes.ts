import { Router } from "express";
import { z } from "zod";
import { valkeyRateLimit } from "../../valkey/rateLimiter";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/errors";
import { AiService } from "./ai.service";

const router = Router();
const ai = new AiService();

router.post(
  "/ai/search",
  valkeyRateLimit("ai-search", 30, 60),
  asyncHandler(async (req, res) => {
    const body = z.object({ query: z.string().min(2), userId: z.string().optional(), context: z.record(z.unknown()).optional() }).parse(req.body);
    res.json({ data: await ai.agenticSearch(body.query, body.userId) });
  })
);

router.post(
  "/ai/chat",
  valkeyRateLimit("ai-chat", 40, 60),
  asyncHandler(async (req, res) => {
    const body = z.object({ message: z.string().min(1), userId: z.string().optional() }).parse(req.body);
    res.json({ data: await ai.chat(body.message, body.userId) });
  })
);

router.get(
  "/ai/conversations",
  asyncHandler(async (_req, res) => {
    res.json({ data: [] });
  })
);

router.get(
  "/ai/conversations/:id",
  asyncHandler(async (req, res) => {
    throw new AppError(404, `Conversation ${req.params.id} is not retained in this demo view`);
  })
);

router.post(
  "/ai/products/:id/enrich",
  asyncHandler(async (req, res) => {
    const product = await ai.enrichProduct(req.params.id);
    if (!product) throw new AppError(404, "Product not found");
    res.json({ data: product });
  })
);

router.get(
  "/ai/analytics/insights",
  asyncHandler(async (_req, res) => {
    res.json({ data: await ai.insights() });
  })
);

export default router;
