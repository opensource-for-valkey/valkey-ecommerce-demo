import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { optionalAuth, attachIdentity } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { cartService } from "../services/cart.service.js";
import {
  cartItemSchema,
  cartUpdateSchema,
  couponSchema
} from "../validators/schemas.js";

export const cartRouter = Router();

cartRouter.use(optionalAuth, attachIdentity);

cartRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await cartService.get(req.identity));
  })
);

cartRouter.post(
  "/items",
  validate(cartItemSchema),
  asyncHandler(async (req, res) => {
    const { productId, quantity, variantId } = req.validated.body;
    res.status(201).json(await cartService.add(req.identity, productId, quantity, variantId));
  })
);

cartRouter.patch(
  "/items/:productId",
  validate(cartUpdateSchema),
  asyncHandler(async (req, res) => {
    const { quantity, variantId } = req.validated.body;
    res.json(
      await cartService.update(
        req.identity,
        req.validated.params.productId,
        quantity,
        variantId
      )
    );
  })
);

cartRouter.delete(
  "/items/:productId",
  asyncHandler(async (req, res) => {
    res.json(await cartService.remove(req.identity, req.params.productId, req.query.variantId));
  })
);

cartRouter.post(
  "/coupon",
  validate(couponSchema),
  asyncHandler(async (req, res) => {
    res.json(await cartService.applyCoupon(req.identity, req.validated.body.code));
  })
);

cartRouter.delete(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await cartService.clear(req.identity));
  })
);

