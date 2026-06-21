import { Router } from "express";
import { z } from "zod";
import type { Inventory, Notification, Product } from "../../types/domain";
import { EventBus } from "../../valkey/events";
import { getValkey } from "../../valkey/client";
import { JsonRepository } from "../../valkey/jsonRepository";
import { keys } from "../../valkey/keys";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/errors";

const router = Router();
const inventory = new JsonRepository<Inventory>();
const products = new JsonRepository<Product>();
const notifications = new JsonRepository<Notification>();
const events = new EventBus();

router.get(
  "/inventory/:productId",
  asyncHandler(async (req, res) => {
    const data = await inventory.get(keys.inventory(req.params.productId));
    if (!data) throw new AppError(404, "Inventory not found");
    res.json({ data });
  })
);

router.get(
  "/trending",
  asyncHandler(async (_req, res) => {
    const client = await getValkey();
    const ranked = await client.zRangeWithScores(keys.trend("views"), 0, 11, { REV: true });
    const data = await Promise.all(ranked.map(async (entry) => ({ score: entry.score, product: await products.get(keys.product(entry.value)) })));
    res.json({ data: data.filter((entry) => entry.product) });
  })
);

router.get(
  "/recommendations",
  asyncHandler(async (req, res) => {
    const userId = req.query.userId?.toString();
    const client = await getValkey();
    const ids = userId ? await client.zRange(keys.personal(userId), 0, 11, { REV: true }) : await client.zRange(keys.trend("purchases"), 0, 11, { REV: true });
    const data = await Promise.all(ids.map((productId) => products.get(keys.product(productId))));
    res.json({ data: data.filter(Boolean) });
  })
);

router.get(
  "/recently-viewed",
  asyncHandler(async (req, res) => {
    const userId = req.query.userId?.toString() ?? "user_demo";
    const client = await getValkey();
    const ids = await client.lRange(keys.recent(userId), 0, 11);
    const data = await Promise.all(ids.map((productId) => products.get(keys.product(productId))));
    res.json({ data: data.filter(Boolean) });
  })
);

router.get(
  "/notifications",
  asyncHandler(async (req, res) => {
    const userId = req.query.userId?.toString();
    const all = await notifications.scan("shopmind:notification:", 200);
    res.json({ data: userId ? all.filter((item) => item.userId === userId) : all });
  })
);

router.patch(
  "/notifications/:id/read",
  asyncHandler(async (req, res) => {
    const notification = await notifications.get(`shopmind:notification:${req.params.id}`);
    if (!notification) throw new AppError(404, "Notification not found");
    notification.read = true;
    await notifications.set(`shopmind:notification:${notification.id}`, notification);
    res.json({ data: notification });
  })
);

router.get(
  "/delivery/:orderId",
  asyncHandler(async (req, res) => {
    const client = await getValkey();
    const positions = await client.geoPos(keys.geoDrivers, ["driver_1"]);
    res.json({
      data: {
        orderId: req.params.orderId,
        driverId: "driver_1",
        status: "on-the-way",
        etaMinutes: 18,
        progress: 62,
        location: positions[0] ? { lng: Number(positions[0].longitude), lat: Number(positions[0].latitude) } : null
      }
    });
  })
);

router.post(
  "/delivery/:orderId/location",
  asyncHandler(async (req, res) => {
    const body = z.object({ driverId: z.string().default("driver_1"), lat: z.number(), lng: z.number() }).parse(req.body);
    const client = await getValkey();
    await client.geoAdd(keys.geoDrivers, { member: body.driverId, latitude: body.lat, longitude: body.lng });
    const payload = { orderId: req.params.orderId, driverId: body.driverId, lat: body.lat, lng: body.lng, updatedAt: new Date().toISOString() };
    await events.publish(keys.pubOrder(req.params.orderId), payload);
    res.json({ data: payload });
  })
);

export default router;
