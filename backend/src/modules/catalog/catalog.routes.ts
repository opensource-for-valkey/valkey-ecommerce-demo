import { Router } from "express";
import { z } from "zod";
import type { Category, Product } from "../../types/domain";
import { EventBus } from "../../valkey/events";
import { JsonRepository } from "../../valkey/jsonRepository";
import { keys } from "../../valkey/keys";
import { SearchRepository } from "../../valkey/searchRepository";
import { valkeyRateLimit } from "../../valkey/rateLimiter";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/errors";

const router = Router();
const products = new JsonRepository<Product>();
const categories = new JsonRepository<Category>();
const search = new SearchRepository();
const events = new EventBus();

router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const query = z
      .object({
        q: z.string().optional(),
        category: z.string().optional(),
        brand: z.string().optional(),
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),
        sort: z.string().optional(),
        limit: z.coerce.number().max(100).default(24)
      })
      .parse(req.query);
    const data = await search.searchProducts(query);
    res.json({ data, total: data.length });
  })
);

router.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await products.get(keys.product(req.params.id));
    if (!product) throw new AppError(404, "Product not found");
    await events.recordProductEvent("views", product.id, req.headers["x-user-id"]?.toString());
    res.json({ data: product });
  })
);

router.get(
  "/products/:id/similar",
  asyncHandler(async (req, res) => {
    const data = await search.similarProducts(req.params.id, 12);
    res.json({ data });
  })
);

router.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    const data = await categories.scan("shopmind:category:", 100);
    res.json({ data: data.sort((a, b) => a.sortOrder - b.sortOrder) });
  })
);

router.get(
  "/search",
  valkeyRateLimit("search", 80, 60),
  asyncHandler(async (req, res) => {
    const data = await search.searchProducts({
      q: req.query.q?.toString(),
      category: req.query.category?.toString(),
      brand: req.query.brand?.toString(),
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      sort: req.query.sort?.toString(),
      limit: req.query.limit ? Number(req.query.limit) : 24
    });
    res.json({ data, total: data.length });
  })
);

router.get(
  "/search/autocomplete",
  valkeyRateLimit("autocomplete", 120, 60),
  asyncHandler(async (req, res) => {
    const q = z.string().min(1).parse(req.query.q);
    res.json({ data: await search.autocomplete(q) });
  })
);

router.post(
  "/search/semantic",
  valkeyRateLimit("semantic-search", 60, 60),
  asyncHandler(async (req, res) => {
    const body = z.object({ query: z.string().min(2), limit: z.number().max(20).optional() }).parse(req.body);
    res.json({ data: await search.semanticSearch(body.query, body.limit ?? 8) });
  })
);

router.post(
  "/events/product-view",
  asyncHandler(async (req, res) => {
    const body = z.object({ productId: z.string(), userId: z.string().optional() }).parse(req.body);
    await events.recordProductEvent("views", body.productId, body.userId);
    res.json({ ok: true });
  })
);

router.post(
  "/events/product-click",
  asyncHandler(async (req, res) => {
    const body = z.object({ productId: z.string(), userId: z.string().optional() }).parse(req.body);
    await events.recordProductEvent("clicks", body.productId, body.userId);
    res.json({ ok: true });
  })
);

export default router;
