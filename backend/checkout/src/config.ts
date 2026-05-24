export interface CheckoutConfig {
  port: number;
  workerConcurrency: number;
  reservationTtlSeconds: number;
  queuePrefix: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): CheckoutConfig {
  return {
    port: Number(env.CHECKOUT_PORT ?? 4000),
    workerConcurrency: Number(env.CHECKOUT_WORKER_CONCURRENCY ?? 4),
    reservationTtlSeconds: Number(env.RESERVATION_TTL_SECONDS ?? 600),
    queuePrefix: env.CHECKOUT_QUEUE_PREFIX ?? "bull:checkout",
  };
}
