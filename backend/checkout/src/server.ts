import express, { type Request, type Response } from "express";
import type { Redis } from "ioredis";
import { ApiError, errorBody, toApiError } from "./errors";
import { withIdempotency } from "./idempotency";
import type { InventoryScripts } from "./inventoryScripts";
import {
  type CheckoutQueues,
  type CheckoutQueueEvents,
  releaseReservations,
  reserveJobOptions,
} from "./queues";
import {
  ORDER_STREAM_KEY,
  createOrder,
  getOrder,
  listOrdersForUser,
  requireOwnedOrder,
  transitionOrder,
} from "./store";
import type { ApiEnvelope, CartItemInput, Order } from "./types";

export interface CheckoutAppContext {
  client: Redis;
  scripts: InventoryScripts;
  queues: CheckoutQueues;
  events: CheckoutQueueEvents;
}

interface AuthedRequest extends Request {
  userId?: string;
}

function userIdFrom(request: Request): string {
  const userId = request.header("X-User-Id");
  if (!userId) {
    throw new ApiError(401, "unauthorized", "X-User-Id header is required.");
  }
  return userId;
}

function idempotencyKeyFrom(request: Request): string {
  const key = request.header("Idempotency-Key");
  if (!key) {
    throw new ApiError(400, "missing_idempotency_key", "Idempotency-Key header is required.");
  }
  return key;
}

function validateCartItems(value: unknown): CartItemInput[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ApiError(400, "invalid_request", "items must be a non-empty array.");
  }

  return value.map((item) => {
    if (!item || typeof item !== "object") {
      throw new ApiError(400, "invalid_request", "Each item must be an object.");
    }

    const candidate = item as Record<string, unknown>;
    if (typeof candidate.productId !== "string" || !Number.isInteger(candidate.quantity)) {
      throw new ApiError(400, "invalid_request", "Each item requires productId and integer quantity.");
    }

    return {
      productId: candidate.productId,
      quantity: Number(candidate.quantity),
    };
  });
}

function sendEnvelope(response: Response, envelope: ApiEnvelope): void {
  response.status(envelope.status).json(envelope.body);
}

async function waitForOrderJob(
  orderId: string,
  jobPromise: Promise<unknown>,
  client: Redis
): Promise<Order> {
  await jobPromise;
  const order = await getOrder(client, orderId);
  if (!order) {
    throw new ApiError(404, "order_not_found", "Order was not found.");
  }
  return order;
}

export function createCheckoutApp(context: CheckoutAppContext) {
  const app = express();
  app.use(express.json());

  app.use((request: AuthedRequest, _response, next) => {
    try {
      request.userId = userIdFrom(request);
      next();
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/start", async (request: AuthedRequest, response, next) => {
    try {
      const userId = request.userId!;
      const key = idempotencyKeyFrom(request);

      const envelope = await withIdempotency(context.client, userId, key, async () => {
        const body = request.body as Record<string, unknown>;
        const items = validateCartItems(body.items);
        const shippingAddress =
          body.shippingAddress && typeof body.shippingAddress === "object"
            ? (body.shippingAddress as Record<string, unknown>)
            : {};

        const order = await createOrder(context.client, userId, items, shippingAddress);
        const job = await context.queues.inventoryReserve.add(
          `reserve:${order.id}`,
          { orderId: order.id },
          reserveJobOptions()
        );

        const updatedOrder = await waitForOrderJob(
          order.id,
          job.waitUntilFinished(context.events.inventoryReserve, 5000),
          context.client
        );

        if (updatedOrder.status === "inventory_reserve_failed") {
          return {
            status: 409,
            body: errorBody("insufficient_stock", "One or more products do not have enough available stock.", {
              orderId: updatedOrder.id,
            }),
          };
        }

        return {
          status: 201,
          body: { order: updatedOrder },
        };
      });

      sendEnvelope(response, envelope);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/payment", async (request: AuthedRequest, response, next) => {
    try {
      const userId = request.userId!;
      const key = idempotencyKeyFrom(request);

      const envelope = await withIdempotency(context.client, userId, key, async () => {
        const { orderId, paymentInput } = request.body as {
          orderId?: unknown;
          paymentInput?: Record<string, unknown>;
        };
        if (typeof orderId !== "string") {
          throw new ApiError(400, "invalid_request", "orderId is required.");
        }

        const order = await requireOwnedOrder(context.client, orderId, userId);
        if (order.status !== "pending_payment") {
          throw new ApiError(409, "invalid_order_state", "Order is not pending payment.");
        }
        const job = await context.queues.paymentProcess.add(
          `payment:${orderId}`,
          { orderId, paymentInput },
          { attempts: 2, backoff: { type: "exponential", delay: 200 }, removeOnComplete: true }
        );
        const updatedOrder = await waitForOrderJob(
          orderId,
          job.waitUntilFinished(context.events.paymentProcess, 5000),
          context.client
        );

        return {
          status: updatedOrder.status === "payment_failed" ? 402 : 200,
          body: { order: updatedOrder },
        };
      });

      sendEnvelope(response, envelope);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/confirm", async (request: AuthedRequest, response, next) => {
    try {
      const userId = request.userId!;
      const key = idempotencyKeyFrom(request);

      const envelope = await withIdempotency(context.client, userId, key, async () => {
        const { orderId } = request.body as { orderId?: unknown };
        if (typeof orderId !== "string") {
          throw new ApiError(400, "invalid_request", "orderId is required.");
        }

        const order = await requireOwnedOrder(context.client, orderId, userId);
        if (order.status !== "payment_authorized") {
          throw new ApiError(409, "invalid_order_state", "Order must be payment_authorized before confirmation.");
        }
        const job = await context.queues.orderConfirm.add(
          `confirm:${orderId}`,
          { orderId },
          { attempts: 3, backoff: { type: "exponential", delay: 200 }, removeOnComplete: true }
        );
        const updatedOrder = await waitForOrderJob(
          orderId,
          job.waitUntilFinished(context.events.orderConfirm, 5000),
          context.client
        );

        return {
          status: 200,
          body: { order: updatedOrder },
        };
      });

      sendEnvelope(response, envelope);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/cancel", async (request: AuthedRequest, response, next) => {
    try {
      const userId = request.userId!;
      const { orderId } = request.body as { orderId?: unknown };
      if (typeof orderId !== "string") {
        throw new ApiError(400, "invalid_request", "orderId is required.");
      }

      const order = await requireOwnedOrder(context.client, orderId, userId);
      if (["confirmed", "cancelled", "released", "inventory_reserve_failed"].includes(order.status)) {
        throw new ApiError(409, "invalid_order_state", "Order is already terminal.");
      }

      await releaseReservations(context.client, context.scripts, order);
      const cancelled = await transitionOrder(context.client, order, "cancelled");
      response.json({ order: cancelled });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders", async (request: AuthedRequest, response, next) => {
    try {
      const orders = await listOrdersForUser(context.client, request.userId!);
      response.json({ orders });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id", async (request: AuthedRequest, response, next) => {
    try {
      const order = await requireOwnedOrder(context.client, request.params.id, request.userId!);
      response.json({ order });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id/events", async (request: AuthedRequest, response, next) => {
    try {
      await requireOwnedOrder(context.client, request.params.id, request.userId!);

      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");
      response.flushHeaders?.();

      let active = true;
      let lastId = "$";
      request.on("close", () => {
        active = false;
      });

      while (active) {
        const rows = (await context.client.xread(
          "BLOCK",
          1000,
          "STREAMS",
          ORDER_STREAM_KEY,
          lastId
        )) as Array<[string, Array<[string, string[]]>]> | null;

        if (!rows) {
          continue;
        }

        for (const [, entries] of rows) {
          for (const [entryId, fields] of entries) {
            lastId = entryId;
            const event = Object.fromEntries(
              Array.from({ length: fields.length / 2 }, (_, index) => [
                fields[index * 2],
                fields[index * 2 + 1],
              ])
            );
            if (event.orderId === request.params.id) {
              response.write(`id: ${entryId}\n`);
              response.write(`event: order\n`);
              response.write(`data: ${JSON.stringify(event)}\n\n`);
            }
          }
        }
      }

      response.end();
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _request: Request, response: Response, _next: express.NextFunction) => {
    const apiError = toApiError(error);
    response.status(apiError.status).json(errorBody(apiError.error, apiError.message, apiError.details));
  });

  return app;
}
