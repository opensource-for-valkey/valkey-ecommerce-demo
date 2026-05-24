import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { productService } from "../services/product.service.js";
import { orderService } from "../services/order.service.js";
import { inventorySchema, orderStatusSchema } from "../validators/schemas.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get(
  "/analytics",
  asyncHandler(async (_req, res) => {
    res.json({
      data: {
        ...productService.analyticsSnapshot(),
        trending: await productService.trending(6)
      }
    });
  })
);

adminRouter.patch(
  "/inventory/:productId",
  validate(inventorySchema),
  asyncHandler(async (req, res) => {
    res.json({
      data: await productService.adjustInventory(
        req.validated.params.productId,
        req.validated.body.delta
      )
    });
  })
);

adminRouter.patch(
  "/orders/:orderId/status",
  validate(orderStatusSchema),
  asyncHandler(async (req, res) => {
    res.json({
      data: await orderService.updateStatus(
        req.validated.params.orderId,
        req.validated.body.status
      )
    });
  })
);

