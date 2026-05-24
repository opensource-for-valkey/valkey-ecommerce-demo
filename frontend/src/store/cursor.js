// Virtual AI cursor state. The cursor moves to a target element, plays a
// click ripple, and clears itself. Commands are processed in order so the
// user sees the agent's actions in the same order the server emitted them.
//
// Public API:
//   useCursor.getState().enqueue(command)
//   useCursor reads: { active, x, y, label, status }
//
// Command shapes:
//   { action: "navigate", path, why }   — handled by CursorBridge (router)
//   { action: "click", target, why }    — moves + ripples + clicks
//   { action: "highlight", target, why } — moves + glows the element

import { create } from "zustand";

const FLIGHT_MS = 700;
const RIPPLE_MS = 350;
const REST_MS = 250;

const queue = [];
let running = false;

function cssEscape(s) {
    if (typeof window !== "undefined" && window.CSS && window.CSS.escape) {
        return window.CSS.escape(s);
    }
    return String(s).replace(/(["\\])/g, "\\$1");
}

function findTargetEl(target) {
    if (!target || typeof document === "undefined") return null;
    return document.querySelector(`[data-ai-target="${cssEscape(target)}"]`);
}

function pageCenter() {
    return { x: window.innerWidth / 2, y: window.innerHeight - 100 };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const useCursor = create((set, get) => ({
    active: false,
    x: 0,
    y: 0,
    label: null,
    status: "idle", // idle | moving | clicking | highlighting

    enqueue(cmd) {
        queue.push(cmd);
        processQueue(set, get);
    },
}));

async function processQueue(set, get) {
    if (running) return;
    running = true;
    while (queue.length > 0) {
        const cmd = queue.shift();
        try {
            await runCommand(cmd, set, get);
        } catch (err) {
            console.warn("[cursor] command failed:", err);
        }
    }
    set({ active: false, label: null, status: "idle" });
    running = false;
}

async function runCommand(cmd, set, get) {
    const action = cmd.action;
    const why = cmd.why || null;

    if (action === "navigate") {
        // CursorBridge has access to useNavigate; we hand off via a global event.
        window.dispatchEvent(
            new CustomEvent("ai-cursor:navigate", {
                detail: { path: cmd.path, why },
            })
        );
        return;
    }

    const el = findTargetEl(cmd.target);
    if (!el) {
        if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.debug("[cursor] target not found:", cmd.target);
        }
        return;
    }

    // Ensure target is on screen before flying to it.
    const initialRect = el.getBoundingClientRect();
    if (
        initialRect.bottom < 0 ||
        initialRect.top > window.innerHeight ||
        initialRect.right < 0 ||
        initialRect.left > window.innerWidth
    ) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        await sleep(380);
    }

    const start = get().active
        ? { x: get().x, y: get().y }
        : pageCenter();
    set({ active: true, status: "moving", x: start.x, y: start.y, label: why });

    // Force one frame so the CSS transition picks up the new (x,y).
    await new Promise((r) => requestAnimationFrame(r));

    const rect = el.getBoundingClientRect();
    set({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    await sleep(FLIGHT_MS);

    if (action === "click") {
        set({ status: "clicking" });
        el.classList.add("ai-target-pulse");
        // Only forward the click event to elements that explicitly opt in.
        // Most agent actions already mutated server state (e.g. add_to_cart);
        // a real DOM click would fire the user-side handler and double-add.
        const allowsRealClick = el.dataset.aiClickable === "true";
        if (allowsRealClick) {
            try {
                el.click();
            } catch {
                /* ignore */
            }
        }
        await sleep(RIPPLE_MS);
        el.classList.remove("ai-target-pulse");
    } else if (action === "highlight") {
        set({ status: "highlighting" });
        el.classList.add("ai-target-pulse");
        await sleep(RIPPLE_MS * 2);
        el.classList.remove("ai-target-pulse");
    }

    set({ status: "idle" });
    await sleep(REST_MS);
}
