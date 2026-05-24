import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { attachIdentity, optionalAuth } from "../middleware/auth.js";
import { productService } from "../services/product.service.js";
import { productIdSchema, productListSchema } from "../validators/schemas.js";

export const productsRouter = Router();

productsRouter.get(
  "/",
  validate(productListSchema),
  asyncHandler(async (req, res) => {
    res.json(await productService.list(req.validated.query));
  })
);

productsRouter.get(
  "/suggestions",
  asyncHandler(async (req, res) => {
    res.json({ data: productService.suggestions(req.query.q) });
  })
);

productsRouter.get(
  "/trending",
  asyncHandler(async (req, res) => {
    res.json({ data: await productService.trending(Number(req.query.limit) || 6) });
  })
);

productsRouter.get(
  "/recently-viewed",
  optionalAuth,
  attachIdentity,
  asyncHandler(async (req, res) => {
    res.json({ data: await productService.recentlyViewed(req.identity) });
  })
);

productsRouter.get(
  "/:id",
  optionalAuth,
  attachIdentity,
  validate(productIdSchema),
  asyncHandler(async (req, res) => {
    const response = await productService.getById(req.validated.params.id);
    await productService.trackProductView(req.validated.params.id, req.identity);
    res.json(response);
  })
);

productsRouter.get(
  "/:id/recommendations",
  validate(productIdSchema),
  asyncHandler(async (req, res) => {
    res.json({ data: productService.recommendations(req.validated.params.id) });
  })
);

