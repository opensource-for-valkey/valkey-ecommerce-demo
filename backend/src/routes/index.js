import { Router } from "express";
import { adminRouter } from "./admin.routes.js";
import { authRouter } from "./auth.routes.js";
import { cartRouter } from "./cart.routes.js";
import { healthRouter } from "./health.routes.js";
import { ordersRouter } from "./orders.routes.js";
import { productsRouter } from "./products.routes.js";
import { wishlistRouter } from "./wishlist.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/wishlist", wishlistRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/admin", adminRouter);

