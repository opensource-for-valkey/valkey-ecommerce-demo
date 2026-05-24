export interface CheckoutConfig {
  port: number;
  workerConcurrency: number;
  reservationTtlSeconds: number;
  queuePrefix: string;
  corsOrigin: string;
  embeddingServiceUrl: string;
  opensearchUrl: string;
  opensearchIndex: string;
  sessionTtlSeconds: number;
  bcryptRounds: number;
  rateLimitEnabled: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): CheckoutConfig {
  return {
    port: Number(env.CHECKOUT_PORT ?? 4000),
    workerConcurrency: Number(env.CHECKOUT_WORKER_CONCURRENCY ?? 4),
    reservationTtlSeconds: Number(env.RESERVATION_TTL_SECONDS ?? 600),
    queuePrefix: env.CHECKOUT_QUEUE_PREFIX ?? "bull:checkout",
    corsOrigin: env.CORS_ORIGIN ?? "http://localhost:3000",
    embeddingServiceUrl: env.EMBEDDING_SERVICE_URL ?? "http://localhost:8001",
    opensearchUrl: env.OPENSEARCH_URL ?? "http://localhost:9200",
    opensearchIndex: env.OPENSEARCH_INDEX ?? "valkey-ecommerce-logs",
    sessionTtlSeconds: Number(env.AUTH_SESSION_TTL_SECONDS ?? 86400),
    bcryptRounds: Number(env.AUTH_BCRYPT_ROUNDS ?? 12),
    rateLimitEnabled: String(env.RATE_LIMIT_ENABLED ?? "true").toLowerCase() !== "false",
  };
}
