// Server-sent events for the live shopping session.
//
// Each connection subscribes to the signed-in user's channel
// (`user:<id>:events`) and forwards every event from the bus down the wire.
//
// On connect we also send a `hello` event with the current cart snapshot so
// clients have correct state without an extra round-trip.

const express = require("express");
const { requireAuth, nowIso } = require("../lib/auth");
const { loadCart } = require("../services/cart");
const bus = require("../lib/bus");

const router = express.Router();
router.use(requireAuth);

// Heartbeat keeps proxies/load-balancers from killing the connection and gives
// the client a way to detect a half-open socket.
const HEARTBEAT_MS = 25_000;

router.get("/", async (req, res) => {
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
    });
    // Express+CORS already sent CORS headers; SSE just needs flushHeaders.
    res.flushHeaders?.();

    const userId = req.user.id;
    const channel = bus.userChannel(userId);

    function send(event) {
        res.write(`event: ${event.type || "message"}\n`);
        res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    // Hello + initial snapshot
    send({
        type: "hello",
        userId,
        cart: loadCart(userId),
        at: nowIso(),
    });

    const unsubscribe = await bus.subscribe(channel, (event) => {
        try {
            send(event);
        } catch {
            /* socket likely closed; cleanup happens in close handler */
        }
    });

    const heartbeat = setInterval(() => {
        res.write(`: ping ${Date.now()}\n\n`);
    }, HEARTBEAT_MS);

    req.on("close", async () => {
        clearInterval(heartbeat);
        try {
            await unsubscribe();
        } catch {
            /* ignore */
        }
    });
});

module.exports = router;
