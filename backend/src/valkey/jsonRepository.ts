import { getValkey } from "./client";

export class JsonRepository<T extends object> {
  async set(key: string, value: T, ttlSeconds?: number) {
    const client = await getValkey();
    try {
      await client.sendCommand(["JSON.SET", key, "$", JSON.stringify(value)]);
      if (ttlSeconds) await client.expire(key, ttlSeconds);
    } catch {
      await client.set(key, JSON.stringify(value), ttlSeconds ? { EX: ttlSeconds } : undefined);
    }
    return value;
  }

  async get(key: string): Promise<T | null> {
    const client = await getValkey();
    try {
      const raw = await client.sendCommand(["JSON.GET", key]);
      if (!raw) return null;
      const parsed = JSON.parse(String(raw));
      return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      const raw = await client.get(key);
      return raw ? JSON.parse(raw) : null;
    }
  }

  async del(key: string) {
    const client = await getValkey();
    await client.del(key);
  }

  async scan(prefix: string, limit = 100): Promise<T[]> {
    const client = await getValkey();
    const foundKeys = await client.keys(`${prefix}*`);
    const selectedKeys = foundKeys.slice(0, limit);
    if (selectedKeys.length === 0) return [];
    try {
      const rawValues = (await client.sendCommand(["JSON.MGET", ...selectedKeys, "$"])) as unknown[];
      return rawValues
        .map((raw) => {
          if (!raw) return null;
          const parsed = JSON.parse(String(raw));
          return Array.isArray(parsed) ? parsed[0] : parsed;
        })
        .filter(Boolean) as T[];
    } catch {
      const values = await Promise.all(selectedKeys.map((key) => this.get(key)));
      return values.filter(Boolean) as T[];
    }
  }
}
