import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { optionalAuth, attachIdentity } from "../middleware/auth.js";
import { wishlistService } from "../services/wishlist.service.js";

export const wishlistRouter = Router();

wishlistRouter.use(optionalAuth, attachIdentity);

wishlistRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({ data: await wishlistService.list(req.identity) });
  })
);

wishlistRouter.post(
  "/:productId",
  asyncHandler(async (req, res) => {
    res.status(201).json({ data: await wishlistService.add(req.identity, req.params.productId) });
  })
);

wishlistRouter.delete(
  "/:productId",
  asyncHandler(async (req, res) => {
    res.json({ data: await wishlistService.remove(req.identity, req.params.productId) });
  })
);

