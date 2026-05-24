import type { Redis } from "ioredis";
import { ApiError } from "./errors";
import { idempotencyKey, idempotencyLockKey } from "./store";
import type { ApiEnvelope } from "./types";

const REPLAY_TTL_SECONDS = 86400;
const LOCK_TTL_SECONDS = 30;
const LOCK_POLL_INTERVAL_MS = 100;
const LOCK_MAX_POLL_ATTEMPTS = Math.ceil((LOCK_TTL_SECONDS * 1000) / LOCK_POLL_INTERVAL_MS);

export async function withIdempotency(
  client: Redis,
  userId: string,
  key: string,
  produce: () => Promise<ApiEnvelope>
): Promise<ApiEnvelope> {
  if (!key.trim()) {
    throw new ApiError(400, "missing_idempotency_key", "Idempotency-Key header is required.");
  }

  const replayKey = idempotencyKey(userId, key);
  const existing = await client.get(replayKey);
  if (existing) {
    return JSON.parse(existing) as ApiEnvelope;
  }

  const lockKey = idempotencyLockKey(userId, key);
  const lockAcquired = await client.set(lockKey, "1", "EX", LOCK_TTL_SECONDS, "NX");
  if (!lockAcquired) {
    for (let attempt = 0; attempt < LOCK_MAX_POLL_ATTEMPTS; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, LOCK_POLL_INTERVAL_MS));
      const replay = await client.get(replayKey);
      if (replay) {
        return JSON.parse(replay) as ApiEnvelope;
      }
    }
    throw new ApiError(409, "request_in_progress", "A request with this idempotency key is still in progress.");
  }

  try {
    const response = await produce();
    await client.set(replayKey, JSON.stringify(response), "EX", REPLAY_TTL_SECONDS);
    return response;
  } finally {
    await client.del(lockKey);
  }
}
