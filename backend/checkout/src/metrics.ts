import type { Request, Response } from "express";
import type { Redis } from "ioredis";
import { listProducts } from "./store";

export interface RequestMetricsInput {
  method: string;
  route: string;
  status: number;
  durationMs: number;
  userId?: string;
}

export interface BusinessFailureInput {
  reason: string;
  orderId?: string;
}

export interface AnalyticsDashboard {
  windowMinutes: number;
  orders: number;
  revenue: number;
  activeUsers: number;
  api: {
    requests: number;
    errors: number;
    p50Ms: number;
    p95Ms: number;
    p99Ms: number;
    statusCounts: Record<string, number>;
  };
  checkout: {
    failures: Record<string, number>;
    inventoryFailures: number;
  };
  inventory: {
    activeProducts: number;
    onHand: number;
    reserved: number;
  };
  valkey: {
    commands: Record<string, number>;
  };
}

const WINDOW_MINUTES = 60;

export function metricsMiddleware(client: Redis) {
  return (request: Request, response: Response, next: () => void) => {
    const startedAt = process.hrtime.bigint();
    response.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      void recordRequestMetric(client, {
        method: request.method,
        route: routeLabel(request),
        status: response.statusCode,
        durationMs,
        userId: request.header("X-User-Id") ?? undefined,
      });
    });
    next();
  };
}

export async function recordRequestMetric(client: Redis, input: RequestMetricsInput): Promise<void> {
  const minute = minuteBucket();
  const hour = hourBucket();
  const requestField = `${input.method} ${input.route} ${input.status}`;
  const latencyMember = `${Date.now()}:${Math.random().toString(36).slice(2)}`;

  const pipeline = client.pipeline();
  pipeline.hincrby(`metrics:requests:${minute}`, requestField, 1);
  pipeline.expire(`metrics:requests:${minute}`, 86400);
  pipeline.hincrby(`metrics:status:${minute}`, String(input.status), 1);
  pipeline.expire(`metrics:status:${minute}`, 86400);
  pipeline.zadd(`metrics:api_latency:${minute}`, input.durationMs, latencyMember);
  pipeline.expire(`metrics:api_latency:${minute}`, 86400);
  pipeline.hincrby(`metrics:latency_histogram:${minute}`, latencyBucket(input.durationMs), 1);
  pipeline.expire(`metrics:latency_histogram:${minute}`, 86400);

  if (input.userId) {
    pipeline.pfadd(`active_users:${hour}`, input.userId);
    pipeline.expire(`active_users:${hour}`, 172800);
  }

  await ignoreMetricErrors(pipeline.exec());
}

export async function recordOrderMetric(client: Redis, total: number): Promise<void> {
  const minute = minuteBucket();
  const hour = hourBucket();
  const pipeline = client.pipeline();
  pipeline.incr(`metrics:orders:count:${minute}`);
  pipeline.expire(`metrics:orders:count:${minute}`, 86400);
  pipeline.incrbyfloat(`metrics:revenue:${hour}`, total);
  pipeline.expire(`metrics:revenue:${hour}`, 604800);
  await ignoreMetricErrors(pipeline.exec());
}

export async function recordCheckoutFailure(client: Redis, input: BusinessFailureInput): Promise<void> {
  const minute = minuteBucket();
  const pipeline = client.pipeline();
  pipeline.hincrby(`metrics:checkout_failures:${minute}`, input.reason, 1);
  pipeline.expire(`metrics:checkout_failures:${minute}`, 86400);
  if (input.reason.includes("inventory") || input.reason.includes("stock")) {
    pipeline.incr(`metrics:inventory_failures:${minute}`);
    pipeline.expire(`metrics:inventory_failures:${minute}`, 86400);
  }
  await ignoreMetricErrors(pipeline.exec());
}

export async function analyticsDashboard(client: Redis): Promise<AnalyticsDashboard> {
  const minutes = recentMinuteBuckets(WINDOW_MINUTES);
  const hours = recentHourBuckets(24);
  const [
    statusCounts,
    requestCount,
    latencies,
    checkoutFailures,
    inventoryFailures,
    orders,
    revenue,
    activeUsers,
    products,
    valkeyCommands,
  ] = await Promise.all([
    sumStatusCounts(client, minutes),
    sumRequestCount(client, minutes),
    collectLatencies(client, minutes),
    sumHashes(client, minutes.map((minute) => `metrics:checkout_failures:${minute}`)),
    sumStrings(client, minutes.map((minute) => `metrics:inventory_failures:${minute}`)),
    sumStrings(client, minutes.map((minute) => `metrics:orders:count:${minute}`)),
    sumFloats(client, hours.map((hour) => `metrics:revenue:${hour}`)),
    countActiveUsers(client, hours.map((hour) => `active_users:${hour}`)),
    listProducts(client),
    readValkeyCommandStats(client),
  ]);

  const sortedLatencies = latencies.sort((left, right) => left - right);
  const errors = Object.entries(statusCounts).reduce(
    (sum, [status, count]) => (Number(status) >= 500 ? sum + count : sum),
    0
  );

  return {
    windowMinutes: WINDOW_MINUTES,
    orders,
    revenue: round(revenue),
    activeUsers,
    api: {
      requests: requestCount,
      errors,
      p50Ms: percentile(sortedLatencies, 0.5),
      p95Ms: percentile(sortedLatencies, 0.95),
      p99Ms: percentile(sortedLatencies, 0.99),
      statusCounts,
    },
    checkout: {
      failures: checkoutFailures,
      inventoryFailures,
    },
    inventory: {
      activeProducts: products.length,
      onHand: products.reduce((sum, product) => sum + product.inventory.quantity, 0),
      reserved: products.reduce((sum, product) => sum + product.inventory.reserved, 0),
    },
    valkey: {
      commands: valkeyCommands,
    },
  };
}

export async function prometheusMetrics(client: Redis): Promise<string> {
  const dashboard = await analyticsDashboard(client);
  const lines = [
    "# HELP valkey_ecommerce_http_requests_total Total API requests in the rolling dashboard window.",
    "# TYPE valkey_ecommerce_http_requests_total counter",
    `valkey_ecommerce_http_requests_total ${dashboard.api.requests}`,
    "# HELP valkey_ecommerce_http_errors_total Total 5xx API responses in the rolling dashboard window.",
    "# TYPE valkey_ecommerce_http_errors_total counter",
    `valkey_ecommerce_http_errors_total ${dashboard.api.errors}`,
    "# HELP valkey_ecommerce_api_latency_ms API latency percentiles.",
    "# TYPE valkey_ecommerce_api_latency_ms gauge",
    `valkey_ecommerce_api_latency_ms{quantile="0.50"} ${dashboard.api.p50Ms}`,
    `valkey_ecommerce_api_latency_ms{quantile="0.95"} ${dashboard.api.p95Ms}`,
    `valkey_ecommerce_api_latency_ms{quantile="0.99"} ${dashboard.api.p99Ms}`,
    "# HELP valkey_ecommerce_orders_total Confirmed orders in the rolling dashboard window.",
    "# TYPE valkey_ecommerce_orders_total counter",
    `valkey_ecommerce_orders_total ${dashboard.orders}`,
    "# HELP valkey_ecommerce_revenue_total Confirmed order revenue in the rolling dashboard window.",
    "# TYPE valkey_ecommerce_revenue_total counter",
    `valkey_ecommerce_revenue_total ${dashboard.revenue}`,
    "# HELP valkey_ecommerce_active_users Approximate active users from Valkey HyperLogLog.",
    "# TYPE valkey_ecommerce_active_users gauge",
    `valkey_ecommerce_active_users ${dashboard.activeUsers}`,
    "# HELP valkey_ecommerce_inventory_reserved Current reserved inventory.",
    "# TYPE valkey_ecommerce_inventory_reserved gauge",
    `valkey_ecommerce_inventory_reserved ${dashboard.inventory.reserved}`,
    "# HELP valkey_ecommerce_inventory_on_hand Current on-hand inventory.",
    "# TYPE valkey_ecommerce_inventory_on_hand gauge",
    `valkey_ecommerce_inventory_on_hand ${dashboard.inventory.onHand}`,
    "# HELP valkey_ecommerce_checkout_failures_total Checkout failures by reason.",
    "# TYPE valkey_ecommerce_checkout_failures_total counter",
    ...Object.entries(dashboard.checkout.failures).map(
      ([reason, count]) => `valkey_ecommerce_checkout_failures_total{reason="${escapeLabel(reason)}"} ${count}`
    ),
    "# HELP valkey_ecommerce_valkey_command_calls_total Valkey command calls observed by INFO commandstats.",
    "# TYPE valkey_ecommerce_valkey_command_calls_total counter",
    ...Object.entries(dashboard.valkey.commands).map(
      ([command, count]) => `valkey_ecommerce_valkey_command_calls_total{command="${escapeLabel(command)}"} ${count}`
    ),
  ];

  return `${lines.join("\n")}\n`;
}

function routeLabel(request: Request): string {
  if (request.route?.path && typeof request.route.path === "string") {
    return request.route.path;
  }
  return request.path.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi, ":id");
}

function minuteBucket(date = new Date()): string {
  return date.toISOString().slice(0, 16).replace(/[-:T]/g, "");
}

function hourBucket(date = new Date()): string {
  return date.toISOString().slice(0, 13).replace(/[-T]/g, "");
}

function recentMinuteBuckets(count: number): string[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, index) => minuteBucket(new Date(now - index * 60_000)));
}

function recentHourBuckets(count: number): string[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, index) => hourBucket(new Date(now - index * 3_600_000)));
}

function latencyBucket(durationMs: number): string {
  if (durationMs < 50) return "lt_50ms";
  if (durationMs < 100) return "lt_100ms";
  if (durationMs < 250) return "lt_250ms";
  if (durationMs < 500) return "lt_500ms";
  if (durationMs < 1000) return "lt_1s";
  return "gte_1s";
}

async function sumStatusCounts(client: Redis, minutes: string[]): Promise<Record<string, number>> {
  return sumHashes(client, minutes.map((minute) => `metrics:status:${minute}`));
}

async function sumRequestCount(client: Redis, minutes: string[]): Promise<number> {
  const hashes = await Promise.all(minutes.map((minute) => client.hgetall(`metrics:requests:${minute}`)));
  return hashes.reduce(
    (total, hash) => total + Object.values(hash).reduce((sum, value) => sum + Number(value), 0),
    0
  );
}

async function collectLatencies(client: Redis, minutes: string[]): Promise<number[]> {
  const values = await Promise.all(
    minutes.map((minute) => client.zrange(`metrics:api_latency:${minute}`, 0, -1, "WITHSCORES"))
  );
  return values.flatMap((entries) =>
    entries
      .filter((_, index) => index % 2 === 1)
      .map((score) => Number(score))
      .filter(Number.isFinite)
  );
}

async function sumHashes(client: Redis, keys: string[]): Promise<Record<string, number>> {
  const hashes = await Promise.all(keys.map((key) => client.hgetall(key)));
  const result: Record<string, number> = {};
  for (const hash of hashes) {
    for (const [field, value] of Object.entries(hash)) {
      result[field] = (result[field] ?? 0) + Number(value);
    }
  }
  return result;
}

async function sumStrings(client: Redis, keys: string[]): Promise<number> {
  const values = await Promise.all(keys.map((key) => client.get(key)));
  return values.reduce((sum, value) => sum + Number(value ?? 0), 0);
}

async function sumFloats(client: Redis, keys: string[]): Promise<number> {
  const values = await Promise.all(keys.map((key) => client.get(key)));
  return values.reduce((sum, value) => sum + Number(value ?? 0), 0);
}

async function countActiveUsers(client: Redis, keys: string[]): Promise<number> {
  try {
    return await client.pfcount(...keys);
  } catch {
    return 0;
  }
}

async function readValkeyCommandStats(client: Redis): Promise<Record<string, number>> {
  try {
    const info = await client.info("commandstats");
    const commands: Record<string, number> = {};
    for (const line of info.split("\n")) {
      const match = line.match(/^cmdstat_([^:]+):calls=(\d+)/);
      if (match) {
        commands[match[1]] = Number(match[2]);
      }
    }
    return commands;
  } catch {
    return {};
  }
}

function percentile(sorted: number[], quantile: number): number {
  if (sorted.length === 0) {
    return 0;
  }
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * quantile) - 1);
  return round(sorted[index]);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function escapeLabel(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

async function ignoreMetricErrors(promise: Promise<unknown>): Promise<void> {
  try {
    await promise;
  } catch {
    // Metrics must never fail the user path.
  }
}
