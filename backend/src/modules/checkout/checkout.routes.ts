import { Router } from "express";
import { z } from "zod";
import type { Cart, Inventory, Notification, Order } from "../../types/domain";
import { EventBus } from "../../valkey/events";
import { JsonRepository } from "../../valkey/jsonRepository";
import { keys } from "../../valkey/keys";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/errors";
import { id } from "../../utils/ids";

const router = Router();
const carts = new JsonRepository<Cart>();
const inventory = new JsonRepository<Inventory>();
const orders = new JsonRepository<Order>();
const notifications = new JsonRepository<Notification>();
const events = new EventBus();

router.post(
  "/checkout/reserve",
  asyncHandler(async (req, res) => {
    const body = z.object({ userId: z.string(), cartId: z.string().optional() }).parse(req.body);
    const cart = await carts.get(keys.cartUser(body.userId));
    if (!cart || cart.items.length === 0) throw new AppError(400, "Cart is empty");
    for (const item of cart.items) {
      const stock = await inventory.get(keys.inventory(item.productId));
      if (!stock || stock.available < item.quantity) throw new AppError(409, `${item.name} is no longer available`);
      stock.reserved += item.quantity;
      stock.available -= item.quantity;
      stock.updatedAt = new Date().toISOString();
      await inventory.set(keys.inventory(item.productId), stock);
      await events.publish(keys.pubInventory, { productId: item.productId, inventory: stock });
      await events.addStream(keys.streamInventory, { productId: item.productId, available: stock.available, reserved: stock.reserved });
    }
    const reservationId = id("reservation");
    await new JsonRepository<object>().set(keys.reservation(reservationId), { userId: body.userId, items: cart.items, createdAt: new Date().toISOString() }, 60 * 10);
    res.json({ reservationId, expiresInSeconds: 600 });
  })
);

router.post(
  "/checkout/orders",
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        userId: z.string(),
        address: z.object({
          id: z.string().default("addr_checkout"),
          name: z.string(),
          line1: z.string(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string(),
          lat: z.number().optional(),
          lng: z.number().optional()
        })
      })
      .parse(req.body);
    const cart = await carts.get(keys.cartUser(body.userId));
    if (!cart || cart.items.length === 0) throw new AppError(400, "Cart is empty");
    const now = new Date().toISOString();
    const order: Order = {
      id: id("order"),
      userId: body.userId,
      items: cart.items,
      address: body.address,
      paymentStatus: "paid",
      orderStatus: "created",
      totals: { subtotal: cart.subtotal, discount: cart.discount, tax: cart.tax, total: cart.total },
      trackingId: id("trk"),
      createdAt: now
    };
    await orders.set(keys.order(order.id), order);
    await events.addStream(keys.streamOrders, { orderId: order.id, userId: body.userId, status: order.orderStatus, total: order.totals.total });
    const notice: Notification = {
      id: id("notif"),
      userId: body.userId,
      type: "order",
      title: "Order placed",
      body: `Your order ${order.id} is confirmed.`,
      read: false,
      metadata: { orderId: order.id },
      createdAt: now
    };
    await notifications.set(`shopmind:notification:${notice.id}`, notice);
    await events.publish(keys.pubUserNotifications(body.userId), notice);
    await carts.set(keys.cartUser(body.userId), { ...cart, items: [], subtotal: 0, discount: 0, tax: 0, total: 0, updatedAt: now });
    res.status(201).json({ data: order });
  })
);

router.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const userId = req.query.userId?.toString();
    const all = await orders.scan("shopmind:order:", 1000);
    res.json({ data: userId ? all.filter((order) => order.userId === userId) : all });
  })
);

router.get(
  "/orders/:id",
  asyncHandler(async (req, res) => {
    const order = await orders.get(keys.order(req.params.id));
    if (!order) throw new AppError(404, "Order not found");
    res.json({ data: order });
  })
);

export default router;
