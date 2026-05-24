// Valkey client. Two connections: one for normal commands, one dedicated to
// pub/sub (Valkey/Redis subscribers can't run other commands on the same
// connection). Both reuse the same lazy connection settings so we don't
// crash the API when Valkey isn't running — Phase 2's bus falls back to an
// in-process EventEmitter in that case.

const Valkey = require("iovalkey");

const VALKEY_URL = process.env.VALKEY_URL || "redis://localhost:6379";

const SHARED_OPTS = {
    // Don't block requests on connection errors; the bus handles fallback.
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => Math.min(times * 200, 5000),
};

function buildClient(role) {
    const client = new Valkey(VALKEY_URL, SHARED_OPTS);
    client.on("error", (err) => {
        // Limit log noise — log once per session-ish, not per command attempt.
        if (!client._loggedError || Date.now() - client._loggedError > 30_000) {
            console.warn(`[valkey:${role}] ${err.code || err.message}`);
            client._loggedError = Date.now();
        }
    });
    client.on("connect", () => console.log(`[valkey:${role}] connected ${VALKEY_URL}`));
    return client;
}

const cmd = buildClient("cmd");
const sub = buildClient("sub");

async function connect() {
    await Promise.allSettled([cmd.connect(), sub.connect()]);
}

async function isReady() {
    try {
        if (cmd.status !== "ready") await cmd.connect();
        const pong = await cmd.ping();
        return pong === "PONG";
    } catch {
        return false;
    }
}

module.exports = { cmd, sub, connect, isReady, VALKEY_URL };
