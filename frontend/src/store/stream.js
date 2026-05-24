// Server-Sent Events client. Opens a single EventSource for the signed-in
// user, applies known event types to the right Zustand store, reconnects
// with backoff on failure, and shuts down on sign-out.
//
// Backend channel format (see backend/src/routes/stream.js):
//   event: hello             — {type, userId, cart, at}
//   event: cart.updated      — {type, source, cart, at}
//   event: chat.message      — {type, message, at}
//   event: chat.tool_call    — {type, toolCallId, name, arguments, at}
//   event: chat.tool_result  — {type, message, at}

import { useEffect } from "react";
import { useAuth } from "./auth";
import { useCart } from "./cart";
import { useChat } from "./chat";
import { useCursor } from "./cursor";

const BASE_URL = (
    process.env.REACT_APP_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

const KNOWN_EVENTS = [
    "hello",
    "cart.updated",
    "chat.message",
    "chat.tool_call",
    "chat.tool_result",
    "chat.cleared",
    "ui.command",
];

let activeSource = null;
let reconnectTimer = null;
let lastUserId = null;
let backoffMs = 1000;
const MAX_BACKOFF_MS = 30_000;

function applyEvent(payload) {
    if (!payload || typeof payload !== "object") return;

    switch (payload.type) {
        case "hello":
        case "cart.updated":
            if (payload.cart) {
                useCart.setState({ ...payload.cart, error: null });
            }
            break;
        case "chat.message":
            useChat.getState().applyMessage(payload.message);
            break;
        case "chat.tool_call":
            useChat.getState().applyToolCall(payload);
            break;
        case "chat.tool_result":
            useChat.getState().applyMessage(payload.message);
            break;
        case "chat.cleared":
            useChat.getState().reset();
            break;
        case "ui.command":
            if (payload.command) {
                useCursor.getState().enqueue(payload.command);
            }
            break;
        default:
            if (process.env.NODE_ENV === "development") {
                // eslint-disable-next-line no-console
                console.debug("[stream] unhandled event:", payload.type, payload);
            }
    }
}

function close() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    if (activeSource) {
        activeSource.close();
        activeSource = null;
    }
}

function makeListener(evtName) {
    return (ev) => {
        if (evtName === "hello") backoffMs = 1000;
        try {
            applyEvent(JSON.parse(ev.data));
        } catch (err) {
            console.warn(`[stream] ${evtName} parse failed:`, err);
        }
    };
}

function open(userId) {
    // Idempotent: if we're already connected for this user, do nothing.
    if (activeSource && lastUserId === userId) return;
    close();
    lastUserId = userId;

    const url = `${BASE_URL}/api/stream`;
    const es = new EventSource(url, { withCredentials: true });
    activeSource = es;

    for (const evtName of KNOWN_EVENTS) {
        es.addEventListener(evtName, makeListener(evtName));
    }

    es.onerror = () => {
        if (es.readyState === EventSource.CLOSED || es.readyState === EventSource.CONNECTING) {
            // Browsers auto-retry CONNECTING. We only schedule a manual reconnect if
            // CLOSED so we don't fight the built-in retry.
            if (es.readyState === EventSource.CLOSED) {
                es.close();
                if (activeSource === es) activeSource = null;
                if (lastUserId) {
                    const delay = backoffMs;
                    backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
                    reconnectTimer = setTimeout(() => {
                        if (lastUserId) open(lastUserId);
                    }, delay);
                }
            }
        }
    };
}

// Hook for any top-level component to mount the stream lifecycle.
export function useStream() {
    const userId = useAuth((s) => s.user?.id);

    useEffect(() => {
        if (userId) {
            open(userId);
        } else {
            lastUserId = null;
            close();
        }
        return () => {
            // We intentionally don't close on unmount — the stream lives for the
            // lifetime of the session, not a single component. Sign-out triggers
            // close via the userId effect above.
        };
    }, [userId]);
}
