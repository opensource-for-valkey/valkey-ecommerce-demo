import { Job, Queue, QueueEvents, Worker, type JobsOptions } from "bullmq";
import type { Redis } from "ioredis";
import type { CheckoutConfig } from "./config";
import type { ValkeyConnectionOptions } from "./connection";
import { ApiError } from "./errors";
import { InventoryScripts } from "./inventoryScripts";
import { processStubPayment, type PaymentInput } from "./payment";
import {
  emitOrderEvent,
  getOrder,
  productKey,
  reservationKey,
  saveOrder,
  transitionOrder,
} from "./store";
import type { Order } from "./types";

export const QUEUE_NAMES = {
  inventoryReserve: "inventory.reserve",
  paymentProcess: "payment.process",
  orderConfirm: "order.confirm",
  reservationRelease: "reservation.release",
  deliveryDispatch: "delivery.dispatch",
} as const;

export interface CheckoutQueues {
  inventoryReserve: Queue;
  paymentProcess: Queue;
  orderConfirm: Queue;
  reservationRelease: Queue;
  deliveryDispatch: Queue;
}

export interface CheckoutQueueEvents {
  inventoryReserve: QueueEvents;
  paymentProcess: QueueEvents;
  orderConfirm: QueueEvents;
  reservationRelease: QueueEvents;
  deliveryDispatch: QueueEvents;
}

export interface CheckoutWorkers {
  inventoryReserve: Worker;
  paymentProcess: Worker;
  orderConfirm: Worker;
  reservationRelease: Worker;
  deliveryDispatch: Worker;
}

export interface QueueRuntime {
  queues: CheckoutQueues;
  events: CheckoutQueueEvents;
  workers: CheckoutWorkers;
  close(): Promise<void>;
}

export interface OrderJobData {
  orderId: string;
}

export interface PaymentJobData extends OrderJobData {
  paymentInput?: PaymentInput;
}

const RESERVE_JOB_OPTIONS: JobsOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 200,
  },
  removeOnComplete: {
    age: 86400,
    count: 1000,
  },
  removeOnFail: {
    age: 86400,
    count: 1000,
  },
};

export async function createQueueRuntime(
  connection: ValkeyConnectionOptions,
  client: Redis,
  scripts: InventoryScripts,
  config: CheckoutConfig
): Promise<QueueRuntime> {
  const queueOptions = {
    connection,
    prefix: config.queuePrefix,
  };

  const queues: CheckoutQueues = {
    inventoryReserve: new Queue(QUEUE_NAMES.inventoryReserve, queueOptions),
    paymentProcess: new Queue(QUEUE_NAMES.paymentProcess, queueOptions),
    orderConfirm: new Queue(QUEUE_NAMES.orderConfirm, queueOptions),
    reservationRelease: new Queue(QUEUE_NAMES.reservationRelease, queueOptions),
    deliveryDispatch: new Queue(QUEUE_NAMES.deliveryDispatch, queueOptions),
  };

  const events: CheckoutQueueEvents = {
    inventoryReserve: new QueueEvents(QUEUE_NAMES.inventoryReserve, queueOptions),
    paymentProcess: new QueueEvents(QUEUE_NAMES.paymentProcess, queueOptions),
    orderConfirm: new QueueEvents(QUEUE_NAMES.orderConfirm, queueOptions),
    reservationRelease: new QueueEvents(QUEUE_NAMES.reservationRelease, queueOptions),
    deliveryDispatch: new QueueEvents(QUEUE_NAMES.deliveryDispatch, queueOptions),
  };

  await Promise.all(Object.values(events).map((event) => event.waitUntilReady()));

  const workers: CheckoutWorkers = {
    inventoryReserve: new Worker(
      QUEUE_NAMES.inventoryReserve,
      async (job: Job<OrderJobData>) => reserveInventory(client, scripts, queues, config, job.data.orderId),
      { ...queueOptions, concurrency: config.workerConcurrency }
    ),
    paymentProcess: new Worker(
      QUEUE_NAMES.paymentProcess,
      async (job: Job<PaymentJobData>) => processPayment(client, job.data.orderId, job.data.paymentInput),
      { ...queueOptions, concurrency: config.workerConcurrency }
    ),
    orderConfirm: new Worker(
      QUEUE_NAMES.orderConfirm,
      async (job: Job<OrderJobData>) => confirmOrder(client, scripts, queues, job.data.orderId),
      { ...queueOptions, concurrency: config.workerConcurrency }
    ),
    reservationRelease: new Worker(
      QUEUE_NAMES.reservationRelease,
      async (job: Job<OrderJobData>) => releaseReservationJob(client, scripts, job.data.orderId),
      { ...queueOptions, concurrency: config.workerConcurrency }
    ),
    deliveryDispatch: new Worker(
      QUEUE_NAMES.deliveryDispatch,
      async (job: Job<OrderJobData>) => dispatchDelivery(client, job.data.orderId),
      { ...queueOptions, concurrency: config.workerConcurrency }
    ),
  };

  await Promise.all(Object.values(workers).map((worker) => worker.waitUntilReady()));

  return {
    queues,
    events,
    workers,
    async close() {
      await Promise.all(Object.values(workers).map((worker) => worker.close()));
      await Promise.all(Object.values(events).map((event) => event.close()));
      await Promise.all(Object.values(queues).map((queue) => queue.close()));
    },
  };
}

export function reserveJobOptions(): JobsOptions {
  return { ...RESERVE_JOB_OPTIONS };
}

export async function releaseReservations(client: Redis, scripts: InventoryScripts, order: Order): Promise<void> {
  for (const item of order.items) {
    await scripts.release(productKey(item.productId), item.quantity);
    await client.del(reservationKey(order.id, item.productId));
  }
}

async function reserveInventory(
  client: Redis,
  scripts: InventoryScripts,
  queues: CheckoutQueues,
  config: CheckoutConfig,
  orderId: string
): Promise<Order> {
  const order = await getOrder(client, orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  const reserved: Array<{ productId: string; quantity: number }> = [];
  for (const item of order.items) {
    const ok = await scripts.reserve(productKey(item.productId), item.quantity);
    if (!ok) {
      for (const reservedItem of reserved) {
        await scripts.release(productKey(reservedItem.productId), reservedItem.quantity);
        await client.del(reservationKey(order.id, reservedItem.productId));
      }
      return transitionOrder(client, order, "inventory_reserve_failed");
    }

    reserved.push({ productId: item.productId, quantity: item.quantity });
    await client.set(reservationKey(order.id, item.productId), item.quantity, "EX", config.reservationTtlSeconds);
  }

  const nextOrder = await transitionOrder(client, order, "pending_payment");
  await queues.reservationRelease.add(
    `release:${order.id}`,
    { orderId: order.id },
    {
      jobId: `release:${order.id}`,
      delay: config.reservationTtlSeconds * 1000,
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 500,
      },
      removeOnComplete: true,
    }
  );
  return nextOrder;
}

async function processPayment(
  client: Redis,
  orderId: string,
  paymentInput?: PaymentInput
): Promise<Order> {
  const order = await getOrder(client, orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }
  if (order.status !== "pending_payment") {
    throw new ApiError(409, "invalid_order_state", "Order is not pending payment.");
  }

  const result = await processStubPayment(order.id, paymentInput);
  const nextOrder = {
    ...order,
    payment: {
      method: "stub",
      transactionId: result.transactionId,
      status: result.status,
    },
  };

  await saveOrder(client, nextOrder);

  if (result.status === "authorized") {
    return transitionOrder(client, nextOrder, "payment_authorized");
  }

  return transitionOrder(client, nextOrder, "payment_failed");
}

async function confirmOrder(
  client: Redis,
  scripts: InventoryScripts,
  queues: CheckoutQueues,
  orderId: string
): Promise<Order> {
  const order = await getOrder(client, orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }
  if (order.status !== "payment_authorized") {
    throw new ApiError(409, "invalid_order_state", "Order must be payment_authorized before confirmation.");
  }

  const committedItems: Order["items"] = [];

  try {
    for (const item of order.items) {
      const nextQuantity = await scripts.commit(productKey(item.productId), item.quantity);
      if (nextQuantity < 0) {
        throw new ApiError(409, "inventory_commit_failed", "Reserved inventory could not be committed.");
      }
      committedItems.push(item);
    }
  } catch (error) {
    if (committedItems.length > 0) {
      await releaseReservations(client, scripts, {
        ...order,
        items: committedItems,
      });
    }
    throw error;
  }

  for (const item of order.items) {
    await client.del(reservationKey(order.id, item.productId));
  }

  const releaseJob = await queues.reservationRelease.getJob(`release:${order.id}`);
  if (releaseJob) {
    await releaseJob.remove();
  }

  const confirmed = await transitionOrder(client, order, "confirmed");
  await queues.deliveryDispatch.add(`dispatch:${order.id}`, { orderId: order.id }, { removeOnComplete: true });
  return confirmed;
}

async function releaseReservationJob(client: Redis, scripts: InventoryScripts, orderId: string): Promise<Order | null> {
  const order = await getOrder(client, orderId);
  if (!order) {
    return null;
  }

  if (["confirmed", "cancelled", "released", "inventory_reserve_failed"].includes(order.status)) {
    return order;
  }

  await releaseReservations(client, scripts, order);
  return transitionOrder(client, order, "released");
}

async function dispatchDelivery(client: Redis, orderId: string): Promise<void> {
  const order = await getOrder(client, orderId);
  if (!order) {
    return;
  }

  await emitOrderEvent(client, order.id, order.userId, order.status, order.status);
}
