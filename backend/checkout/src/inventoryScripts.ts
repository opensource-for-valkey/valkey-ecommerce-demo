import type { Redis } from "ioredis";

const RESERVE_SCRIPT = `
local quantity = cjson.decode(redis.call('JSON.GET', KEYS[1], '$.inventory.quantity'))[1]
local reserved = cjson.decode(redis.call('JSON.GET', KEYS[1], '$.inventory.reserved'))[1]
local requested = tonumber(ARGV[1])

if quantity - reserved >= requested then
  redis.call('JSON.NUMINCRBY', KEYS[1], '$.inventory.reserved', requested)
  return 1
end

return 0
`;

const COMMIT_SCRIPT = `
local quantity = cjson.decode(redis.call('JSON.GET', KEYS[1], '$.inventory.quantity'))[1]
local reserved = cjson.decode(redis.call('JSON.GET', KEYS[1], '$.inventory.reserved'))[1]
local requested = tonumber(ARGV[1])

if quantity < requested or reserved < requested then
  return -1
end

local next_quantity = redis.call('JSON.NUMINCRBY', KEYS[1], '$.inventory.quantity', -requested)
redis.call('JSON.NUMINCRBY', KEYS[1], '$.inventory.reserved', -requested)
return cjson.decode(next_quantity)[1]
`;

const RELEASE_SCRIPT = `
local reserved = cjson.decode(redis.call('JSON.GET', KEYS[1], '$.inventory.reserved'))[1]
local requested = tonumber(ARGV[1])
local released = math.min(reserved, requested)

if released > 0 then
  local next_reserved = redis.call('JSON.NUMINCRBY', KEYS[1], '$.inventory.reserved', -released)
  return cjson.decode(next_reserved)[1]
end

return reserved
`;

type ScriptName = "reserve" | "commit" | "release";

export class InventoryScripts {
  private readonly scripts = {
    reserve: RESERVE_SCRIPT,
    commit: COMMIT_SCRIPT,
    release: RELEASE_SCRIPT,
  } satisfies Record<ScriptName, string>;

  private shas = new Map<ScriptName, string>();

  constructor(private readonly client: Redis) {}

  async load(): Promise<void> {
    for (const name of Object.keys(this.scripts) as ScriptName[]) {
      const sha = String(await this.client.script("LOAD", this.scripts[name]));
      this.shas.set(name, sha);
    }
  }

  async reserve(productKey: string, quantity: number): Promise<0 | 1> {
    const result = await this.eval("reserve", productKey, quantity);
    return Number(result) === 1 ? 1 : 0;
  }

  async commit(productKey: string, quantity: number): Promise<number> {
    return Number(await this.eval("commit", productKey, quantity));
  }

  async release(productKey: string, quantity: number): Promise<number> {
    return Number(await this.eval("release", productKey, quantity));
  }

  private async eval(name: ScriptName, key: string, quantity: number): Promise<unknown> {
    const sha = this.shas.get(name) ?? String(await this.client.script("LOAD", this.scripts[name]));
    this.shas.set(name, sha);

    try {
      return await this.client.evalsha(sha, 1, key, String(quantity));
    } catch (error) {
      if (error instanceof Error && error.message.includes("NOSCRIPT")) {
        const nextSha = String(await this.client.script("LOAD", this.scripts[name]));
        this.shas.set(name, nextSha);
        return this.client.evalsha(nextSha, 1, key, String(quantity));
      }
      throw error;
    }
  }
}
