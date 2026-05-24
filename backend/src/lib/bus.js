// Pub/Sub abstraction. Backed by Valkey when reachable, falls back to an
// in-process EventEmitter so the dev server keeps working without a broker.
//
// Channels follow the HACKATHON.md naming: callers pass `user:<id>:events`
// or similar. Payloads are JSON-serialized.
//
// API:
//   bus.publish(channel, event)         -> Promise<void>
//   bus.subscribe(channel, listener)    -> Promise<unsubscribe>
//
// `event` should be a small JSON-serializable object. Listeners receive the
// parsed object.

const { EventEmitter } = require("events");
const { cmd, sub, isReady } = require("./valkey");

// Local fallback. Each channel gets its own EE so unsubscribing is cheap.
const local = new EventEmitter();
local.setMaxListeners(0);

// Subscriber-side state
const subscriberRefCount = new Map(); // channel -> count
const subscriberListeners = new Map(); // channel -> Set<fn>

let valkeyMessageHandlerAttached = false;
function ensureValkeyMessageHandler() {
    if (valkeyMessageHandlerAttached) return;
    valkeyMessageHandlerAttached = true;
    sub.on("message", (channel, raw) => {
        const set = subscriberListeners.get(channel);
        if (!set) return;
        let payload;
        try {
            payload = JSON.parse(raw);
        } catch {
            payload = { raw };
        }
        for (const fn of set) {
            try {
                fn(payload);
            } catch (err) {
                console.warn("[bus] listener error:", err);
            }
        }
    });
}

async function publish(channel, event) {
    const payload = JSON.stringify(event);
    if (await isReady()) {
        await cmd.publish(channel, payload);
        return;
    }
    // Fallback: emit synchronously to in-process listeners.
    setImmediate(() => local.emit(channel, JSON.parse(payload)));
}

async function subscribe(channel, listener) {
    let useValkey = await isReady();

    if (useValkey) {
        ensureValkeyMessageHandler();
        let listeners = subscriberListeners.get(channel);
        if (!listeners) {
            listeners = new Set();
            subscriberListeners.set(channel, listeners);
        }
        listeners.add(listener);

        const next = (subscriberRefCount.get(channel) || 0) + 1;
        subscriberRefCount.set(channel, next);
        if (next === 1) {
            try {
                await sub.subscribe(channel);
            } catch (err) {
                console.warn("[bus] subscribe failed, falling back to local:", err.message);
                useValkey = false;
            }
        }

        if (useValkey) {
            return async function unsubscribe() {
                listeners.delete(listener);
                const remaining = (subscriberRefCount.get(channel) || 1) - 1;
                if (remaining <= 0) {
                    subscriberRefCount.delete(channel);
                    subscriberListeners.delete(channel);
                    try {
                        await sub.unsubscribe(channel);
                    } catch {
                        /* ignore */
                    }
                } else {
                    subscriberRefCount.set(channel, remaining);
                }
            };
        }
    }

    // Local fallback path
    local.on(channel, listener);
    return async function unsubscribe() {
        local.off(channel, listener);
    };
}

function userChannel(userId) {
    return `user:${userId}:events`;
}

module.exports = { publish, subscribe, userChannel };
