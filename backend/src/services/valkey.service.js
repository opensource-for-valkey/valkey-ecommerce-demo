import { createClient } from "redis";
import { config } from "../config/env.js";
import { logger } from "../config/logger.js";

class MemoryStore {
  constructor() {
    this.values = new Map();
    this.sortedSets = new Map();
  }

  isExpired(record) {
    return record?.expiresAt && record.expiresAt <= Date.now();
  }

  get(key) {
    const record = this.values.get(key);
    if (!record || this.isExpired(record)) {
      this.values.delete(key);
      return null;
    }
    return record.value;
  }

  set(key, value, ttlSeconds) {
    this.values.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
    });
  }

  delete(key) {
    this.values.delete(key);
  }

  keys(pattern) {
    const matcher = new RegExp(`^${pattern.replaceAll("*", ".*")}$`);
    return [...this.values.keys()].filter((key) => matcher.test(key));
  }

  increment(key, ttlSeconds) {
    const next = Number(this.get(key) || 0) + 1;
    this.set(key, String(next), ttlSeconds);
    return next;
  }

  zIncrBy(key, increment, member) {
    const set = this.sortedSets.get(key) || new Map();
    const next = Number(set.get(member) || 0) + Number(increment);
    set.set(member, next);
    this.sortedSets.set(key, set);
    return next;
  }

  zRevRange(key, start, stop) {
    const set = this.sortedSets.get(key) || new Map();
    return [...set.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(start, stop + 1)
      .map(([value, score]) => ({ value, score }));
  }
}

class ValkeyService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.memory = new MemoryStore();
  }

  async connect() {
    if (this.connected || config.env === "test") return;

    try {
      this.client = createClient({
        url: config.valkeyUrl,
        socket: {
          connectTimeout: 800,
          reconnectStrategy: false
        }
      });

      this.client.on("error", (error) => {
        this.connected = false;
        logger.warn("Valkey client error; using local memory fallback", {
          message: error.message
        });
      });

      await this.client.connect();
      await this.client.ping();
      this.connected = true;
      logger.info("Connected to Valkey", { url: config.valkeyUrl });
    } catch (error) {
      this.connected = false;
      if (config.valkeyRequired) throw error;
      logger.warn("Valkey unavailable; API will use in-memory fallback", {
        message: error.message
      });
    }
  }

  async disconnect() {
    if (this.connected && this.client) {
      await this.client.quit();
    }
    this.connected = false;
  }

  async get(key) {
    if (this.connected) return this.client.get(key);
    return this.memory.get(key);
  }

  async set(key, value, ttlSeconds) {
    if (this.connected) {
      if (ttlSeconds) return this.client.set(key, value, { EX: ttlSeconds });
      return this.client.set(key, value);
    }
    this.memory.set(key, value, ttlSeconds);
    return "OK";
  }

  async getJson(key) {
    const value = await this.get(key);
    return value ? JSON.parse(value) : null;
  }

  async setJson(key, value, ttlSeconds) {
    return this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async del(key) {
    if (this.connected) return this.client.del(key);
    this.memory.delete(key);
    return 1;
  }

  async delPattern(pattern) {
    if (this.connected) {
      const keys = await this.client.keys(pattern);
      if (keys.length) await this.client.del(keys);
      return keys.length;
    }

    const keys = this.memory.keys(pattern);
    keys.forEach((key) => this.memory.delete(key));
    return keys.length;
  }

  async incrementWithExpire(key, ttlSeconds) {
    if (this.connected) {
      const count = await this.client.incr(key);
      if (count === 1) await this.client.expire(key, ttlSeconds);
      return count;
    }
    return this.memory.increment(key, ttlSeconds);
  }

  async zIncrBy(key, increment, member) {
    if (this.connected) return this.client.zIncrBy(key, increment, member);
    return this.memory.zIncrBy(key, increment, member);
  }

  async zTop(key, limit) {
    if (this.connected) {
      const values = await this.client.zRangeWithScores(key, 0, limit - 1, {
        REV: true
      });
      return values.map((entry) => ({
        value: entry.value,
        score: entry.score
      }));
    }
    return this.memory.zRevRange(key, 0, limit - 1);
  }

  get mode() {
    return this.connected ? "valkey" : "memory";
  }
}

export const valkey = new ValkeyService();

