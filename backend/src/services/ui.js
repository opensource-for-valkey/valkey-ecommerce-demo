// UI command emitter. Backend agents use this to ask the frontend to play
// a cursor animation, navigate, or highlight an element. The client renders
// these as a virtual AI cursor.
//
// Command shapes:
//   { action: "navigate", path: "/shop?categoryId=..." }
//   { action: "click", target: "<data-ai-target>" }
//   { action: "highlight", target: "<data-ai-target>" }

const bus = require("../lib/bus");
const { nowIso } = require("../lib/auth");

async function emit(userId, command) {
    if (!userId) return;
    await bus.publish(bus.userChannel(userId), {
        type: "ui.command",
        command,
        at: nowIso(),
    });
}

module.exports = { emit };
