import { Router } from "express";
import { z } from "zod";
import { requireAdmin, requireAuth } from "../../middleware/auth";
import type { Coupon, Inventory, Order, Product, User } from "../../types/domain";
import { EventBus } from "../../valkey/events";
import { getValkey } from "../../valkey/client";
import { JsonRepository } from "../../valkey/jsonRepository";
import { keys } from "../../valkey/keys";
import { embeddingFor } from "../../valkey/searchRepository";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/errors";
import { id } from "../../utils/ids";

const router = Router();
const products = new JsonRepository<Product>();
const inventory = new JsonRepository<Inventory>();
const coupons = new JsonRepository<Coupon>();
const orders = new JsonRepository<Order>();
const users = new JsonRepository<User>();
const events = new EventBus();

router.use(requireAuth, requireAdmin);

router.get(
  "/admin/products",
  asyncHandler(async (_req, res) => res.json({ data: await products.scan("shopmind:product:", 2000) }))
);

router.post(
  "/admin/products",
  asyncHandler(async (req, res) => {
    const body = z.object({ name: z.string(), brand: z.string(), categoryId: z.string(), price: z.number(), description: z.string().default("") }).parse(req.body);
    const now = new Date().toISOString();
    const product: Product = {
      id: id("prod"),
      sku: `SM-CUSTOM-${Date.now()}`,
      name: body.name,
      slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      brand: body.brand,
      categoryId: body.categoryId,
      vendorId: "vendor_admin",
      price: body.price,
      mrp: Math.round(body.price * 1.1),
      currency: "INR",
      rating: 4.4,
      reviewCount: 0,
      description: body.description,
      aiDescription: body.description,
      tags: [body.brand.toLowerCase()],
      keywords: [body.name.toLowerCase(), body.brand.toLowerCase()],
      attributes: {},
      images: ["/assets/images/thumbs/product-img1.png"],
      inventoryId: "",
      embedding: embeddingFor(`${body.name} ${body.brand} ${body.description}`),
      status: "active",
      createdAt: now,
      updatedAt: now
    };
    product.inventoryId = product.id;
    await products.set(keys.product(product.id), product);
    await inventory.set(keys.inventory(product.id), { productId: product.id, stock: 50, reserved: 0, available: 50, warehouseId: "wh_admin", lowStockThreshold: 8, updatedAt: now });
    res.status(201).json({ data: product });
  })
);

router.patch(
  "/admin/inventory/:productId",
  asyncHandler(async (req, res) => {
    const body = z.object({ stock: z.number().min(0), reserved: z.number().min(0).default(0) }).parse(req.body);
    const item: Inventory = {
      productId: req.params.productId,
      stock: body.stock,
      reserved: body.reserved,
      available: Math.max(0, body.stock - body.reserved),
      warehouseId: "wh_admin",
      lowStockThreshold: 8,
      updatedAt: new Date().toISOString()
    };
    await inventory.set(keys.inventory(item.productId), item);
    await events.publish(keys.pubInventory, { productId: item.productId, inventory: item });
    res.json({ data: item });
  })
);

router.get(
  "/admin/coupons",
  asyncHandler(async (_req, res) => res.json({ data: await coupons.scan("shopmind:coupon:", 200) }))
);

router.get(
  "/admin/orders",
  asyncHandler(async (_req, res) => res.json({ data: await orders.scan("shopmind:order:", 1000) }))
);

router.patch(
  "/admin/orders/:id",
  asyncHandler(async (req, res) => {
    const body = z.object({ orderStatus: z.enum(["created", "confirmed", "packed", "shipped", "delivered", "cancelled"]) }).parse(req.body);
    const order = await orders.get(keys.order(req.params.id));
    if (!order) throw new AppError(404, "Order not found");
    order.orderStatus = body.orderStatus;
    await orders.set(keys.order(order.id), order);
    await events.publish(keys.pubOrder(order.id), { orderId: order.id, status: order.orderStatus });
    res.json({ data: order });
  })
);

router.get(
  "/admin/users",
  asyncHandler(async (_req, res) => {
    const data = (await users.scan("shopmind:user:", 1000)).map(({ passwordHash: _passwordHash, ...user }) => user);
    res.json({ data });
  })
);

router.get(
  "/admin/analytics/overview",
  asyncHandler(async (_req, res) => {
    const client = await getValkey();
    const [views, carts, purchases, orderList] = await Promise.all([
      client.zRangeWithScores(keys.trend("views"), 0, 9, { REV: true }),
      client.zRangeWithScores(keys.trend("carts"), 0, 9, { REV: true }),
      client.zRangeWithScores(keys.trend("purchases"), 0, 9, { REV: true }),
      orders.scan("shopmind:order:", 1000)
    ]);
    const revenue = orderList.reduce((sum, order) => sum + order.totals.total, 0);
    res.json({
      data: {
        revenue,
        orders: orderList.length,
        searches: 1240,
        aiUsage: 318,
        conversionRate: purchases.length ? Number(((purchases.length / Math.max(views.length, 1)) * 100).toFixed(2)) : 0,
        topProducts: { views, carts, purchases }
      }
    });
  })
);

export default router;
