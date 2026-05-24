import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { optionalAuth, attachIdentity } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { orderService } from "../services/order.service.js";
import { checkoutSchema } from "../validators/schemas.js";

export const ordersRouter = Router();

ordersRouter.use(optionalAuth, attachIdentity);

ordersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({ data: await orderService.list(req.identity) });
  })
);

ordersRouter.post(
  "/checkout",
  validate(checkoutSchema),
  asyncHandler(async (req, res) => {
    res.status(201).json({ data: await orderService.checkout(req.identity, req.validated.body) });
  })
);

ordersRouter.get(
  "/:orderId",
  asyncHandler(async (req, res) => {
    res.json({ data: await orderService.get(req.params.orderId) });
  })
);

