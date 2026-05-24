import IORedis, { type Redis, type RedisOptions } from "ioredis";

export type ValkeyConnectionOptions = RedisOptions & {
  maxRetriesPerRequest: null;
  enableReadyCheck: false;
};

export function createValkeyConnection(env: NodeJS.ProcessEnv = process.env): ValkeyConnectionOptions {
  const tlsFromEnv = String(env.VALKEY_TLS ?? "").toLowerCase() === "true";
  const base = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...(tlsFromEnv ? { tls: {} } : {}),
  } satisfies Pick<ValkeyConnectionOptions, "maxRetriesPerRequest" | "enableReadyCheck"> & {
    tls?: Record<string, never>;
  };

  if (env.VALKEY_URL) {
    const url = new URL(env.VALKEY_URL);
    const isTls = url.protocol === "rediss:" || tlsFromEnv;
    const db = url.pathname && url.pathname !== "/" ? Number(url.pathname.slice(1)) : undefined;

    return {
      ...base,
      host: url.hostname || "localhost",
      port: Number(url.port || 6379),
      username: url.username ? decodeURIComponent(url.username) : undefined,
      password: url.password ? decodeURIComponent(url.password) : undefined,
      db: Number.isFinite(db) ? db : undefined,
      ...(isTls ? { tls: {} } : {}),
    };
  }

  return {
    ...base,
    host: env.VALKEY_HOST ?? "localhost",
    port: Number(env.VALKEY_PORT ?? 6379),
    username: env.VALKEY_USERNAME || undefined,
    password: env.VALKEY_PASSWORD || undefined,
  };
}

export function createValkeyClient(env: NodeJS.ProcessEnv = process.env): Redis {
  return new IORedis(createValkeyConnection(env));
}

export function createValkeyClientFromConnection(connection: ValkeyConnectionOptions): Redis {
  return new IORedis(connection);
}

export async function assertValkeyReachable(client: Redis): Promise<void> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("valkey_unreachable")), 5000);
  });

  await Promise.race([client.ping(), timeout]);
}
