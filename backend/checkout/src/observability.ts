import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import type { Redis } from "ioredis";
import type { CheckoutConfig } from "./config";

export const APP_LOG_STREAM = "logs:app";
const TRACE_TTL_SECONDS = 86400;
const LOG_GROUP = "opensearch-forwarder";
const LOG_CONSUMER = `checkout-api-${process.pid}`;

export interface TraceRequest extends Request {
  traceId?: string;
  observedStart?: bigint;
}

export interface StructuredLog {
  level: "debug" | "info" | "warn" | "error";
  event: string;
  traceId: string;
  message: string;
  route?: string;
  method?: string;
  status?: number;
  durationMs?: number;
  userId?: string;
  orderId?: string;
  error?: string;
  details?: Record<string, unknown>;
}

export interface OpenSearchForwarder {
  close(): void;
}

export function traceMiddleware(client: Redis) {
  return (request: TraceRequest, response: Response, next: NextFunction) => {
    const traceId = request.header("X-Trace-Id") || crypto.randomUUID();
    request.traceId = traceId;
    request.observedStart = process.hrtime.bigint();
    response.setHeader("X-Trace-Id", traceId);

    response.on("finish", () => {
      const durationMs = request.observedStart
        ? Number(process.hrtime.bigint() - request.observedStart) / 1_000_000
        : undefined;

      void recordLog(client, {
        level: response.statusCode >= 500 ? "error" : response.statusCode >= 400 ? "warn" : "info",
        event: "http_request",
        traceId,
        message: `${request.method} ${request.path} ${response.statusCode}`,
        route: request.route?.path && typeof request.route.path === "string" ? request.route.path : request.path,
        method: request.method,
        status: response.statusCode,
        durationMs,
        userId: request.header("X-User-Id") ?? undefined,
      });
    });

    next();
  };
}

export async function recordLog(client: Redis, log: StructuredLog): Promise<void> {
  const payload: Record<string, string> = {
    ts: new Date().toISOString(),
    level: log.level,
    event: log.event,
    traceId: log.traceId,
    message: log.message,
  };

  for (const [key, value] of Object.entries(log)) {
    if (value === undefined || key in payload) {
      continue;
    }
    payload[key] = typeof value === "object" ? JSON.stringify(value) : String(value);
  }

  const args = Object.entries(payload).flatMap(([key, value]) => [key, value]);
  await client.xadd(APP_LOG_STREAM, "MAXLEN", "~", "100000", "*", ...args);
  await client.call("JSON.SET", `trace:${log.traceId}`, "$", JSON.stringify({ traceId: log.traceId, last: payload }));
  await client.expire(`trace:${log.traceId}`, TRACE_TTL_SECONDS);
}

export async function listRecentLogs(client: Redis, count = 100): Promise<Array<Record<string, string>>> {
  const entries = (await client.xrevrange(APP_LOG_STREAM, "+", "-", "COUNT", count)) as Array<[string, string[]]>;
  return entries.map(([id, fields]) => ({ id, ...fieldsToRecord(fields) }));
}

export async function traceEvents(client: Redis, traceId: string): Promise<{
  trace: Record<string, unknown> | null;
  logs: Array<Record<string, string>>;
}> {
  const [rawTrace, recentLogs] = await Promise.all([
    client.call("JSON.GET", `trace:${traceId}`, "$"),
    listRecentLogs(client, 500),
  ]);

  const trace =
    typeof rawTrace === "string" ? ((JSON.parse(rawTrace) as Array<Record<string, unknown>>)[0] ?? null) : null;

  return {
    trace,
    logs: recentLogs.filter((log) => log.traceId === traceId),
  };
}

export async function topErrors(client: Redis, count = 10): Promise<Array<{ message: string; count: number }>> {
  const logs = await listRecentLogs(client, 500);
  const errors = new Map<string, number>();
  for (const log of logs) {
    if (log.event !== "api_error" && log.level !== "error" && Number(log.status) < 500) {
      continue;
    }
    const message = log.error || log.message || "unknown_error";
    errors.set(message, (errors.get(message) ?? 0) + 1);
  }

  return [...errors.entries()]
    .map(([message, errorCount]) => ({ message, count: errorCount }))
    .sort((left, right) => right.count - left.count)
    .slice(0, count);
}

export async function observabilityHealth(client: Redis, config: CheckoutConfig): Promise<Record<string, unknown>> {
  const streamLength = await client.xlen(APP_LOG_STREAM).catch(() => 0);
  const opensearch = await checkOpenSearch(config.opensearchUrl);
  return {
    status: "ok",
    traceHeaders: true,
    stream: {
      key: APP_LOG_STREAM,
      length: streamLength,
    },
    opensearch,
  };
}

export function startOpenSearchForwarder(client: Redis, config: CheckoutConfig): OpenSearchForwarder {
  let closed = false;
  let running = false;

  const ensureGroup = async () => {
    try {
      await client.xgroup("CREATE", APP_LOG_STREAM, LOG_GROUP, "0", "MKSTREAM");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("BUSYGROUP")) {
        throw error;
      }
    }
  };

  const forwardOnce = async () => {
    if (closed || running) {
      return;
    }
    running = true;
    try {
      await ensureGroup();
      const pending = await readGroupEntries(client, "0");
      const entries = pending.length > 0 ? pending : await readGroupEntries(client, ">");
      if (entries.length === 0) {
        return;
      }

      await sendToOpenSearch(config, entries);
      await client.xack(APP_LOG_STREAM, LOG_GROUP, ...entries.map((entry) => entry.id));
    } catch {
      // Failed entries remain pending in the consumer group and are retried on the next tick.
    } finally {
      running = false;
    }
  };

  const timer = setInterval(() => {
    void forwardOnce();
  }, 2000);
  timer.unref?.();
  void forwardOnce();

  return {
    close() {
      closed = true;
      clearInterval(timer);
    },
  };
}

async function readGroupEntries(
  client: Redis,
  id: "0" | ">"
): Promise<Array<{ id: string; fields: Record<string, string> }>> {
  const rows = (await client.xreadgroup(
    "GROUP",
    LOG_GROUP,
    LOG_CONSUMER,
    "COUNT",
    50,
    "STREAMS",
    APP_LOG_STREAM,
    id
  )) as Array<[string, Array<[string, string[]]>]> | null;

  if (!rows) {
    return [];
  }

  return rows.flatMap(([, entries]) => entries.map(([entryId, fields]) => ({ id: entryId, fields: fieldsToRecord(fields) })));
}

async function sendToOpenSearch(
  config: CheckoutConfig,
  entries: Array<{ id: string; fields: Record<string, string> }>
): Promise<void> {
  const body = entries
    .map((entry) =>
      [
        JSON.stringify({ index: { _index: config.opensearchIndex, _id: entry.id } }),
        JSON.stringify({ ...entry.fields, streamId: entry.id }),
      ].join("\n")
    )
    .join("\n");

  const response = await fetch(`${config.opensearchUrl.replace(/\/$/, "")}/_bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/x-ndjson" },
    body: `${body}\n`,
  });

  if (!response.ok) {
    throw new Error(`opensearch_bulk_${response.status}`);
  }
}

async function checkOpenSearch(opensearchUrl: string): Promise<{ reachable: boolean; status?: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1000);
  try {
    const response = await fetch(opensearchUrl, { signal: controller.signal });
    return { reachable: response.ok, status: response.status };
  } catch {
    return { reachable: false };
  } finally {
    clearTimeout(timeout);
  }
}

function fieldsToRecord(fields: string[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (let index = 0; index < fields.length; index += 2) {
    record[fields[index]] = fields[index + 1];
  }
  return record;
}
