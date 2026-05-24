// Chat store. The agent runs server-side: we POST a single user message,
// then watch the SSE channel for assistant turns, tool calls, and tool
// results. Everything renders out of `messages`, which mirrors the persisted
// transcript on the backend.

import { create } from "zustand";
import api from "../api/client";
import { useAuth } from "./auth";

const SORT_BY_TIME = (a, b) => (a.createdAt < b.createdAt ? -1 : 1);

export const useChat = create((set, get) => ({
    open: false,
    loading: false,
    sending: false,
    error: null,
    messages: [],
    // Tool calls in-flight so we can show a "searching…" indicator before the
    // result event lands. Keyed by toolCallId.
    pendingTools: {},

    toggle() {
        set({ open: !get().open });
    },
    setOpen(open) {
        set({ open });
    },

    async refresh() {
        if (!useAuth.getState().user) {
            set({ messages: [], pendingTools: {}, loading: false, error: null });
            return;
        }
        set({ loading: true, error: null });
        try {
            const data = await api.listMessages({ limit: 30 });
            set({ messages: data.messages || [], loading: false });
        } catch (err) {
            if (err.status !== 401) console.warn("[chat] refresh failed:", err);
            set({ loading: false, error: err });
        }
    },

    async send(text) {
        const trimmed = (text || "").trim();
        if (!trimmed) return;
        if (!useAuth.getState().user) {
            set({ error: { message: "Sign in to chat with the assistant." } });
            return;
        }
        set({ sending: true, error: null });
        try {
            // The user's turn arrives on the SSE channel as a chat.message event,
            // so we don't manually push it here — that keeps both tabs in sync.
            await api.sendChat({ message: trimmed });
        } catch (err) {
            set({ error: err });
        } finally {
            set({ sending: false });
        }
    },

    // ----- SSE event handlers -----
    applyMessage(msg) {
        if (!msg) return;
        set((s) => {
            // Replace if already present (idempotent), otherwise append + re-sort.
            const idx = s.messages.findIndex((m) => m.id === msg.id);
            const next = idx >= 0 ? [...s.messages] : [...s.messages, msg];
            if (idx >= 0) next[idx] = msg;
            next.sort(SORT_BY_TIME);
            return { messages: next };
        });

        // If this is a tool result, drop it from pending.
        if (msg.role === "tool" && msg.toolCallId) {
            set((s) => {
                if (!s.pendingTools[msg.toolCallId]) return s;
                const { [msg.toolCallId]: _, ...rest } = s.pendingTools;
                return { pendingTools: rest };
            });
        }
    },

    applyToolCall({ toolCallId, name, arguments: args }) {
        if (!toolCallId) return;
        set((s) => ({
            pendingTools: {
                ...s.pendingTools,
                [toolCallId]: { name, arguments: args, startedAt: Date.now() },
            },
        }));
    },

    reset() {
        set({ messages: [], pendingTools: {}, error: null, sending: false });
    },

    async clearHistory() {
        if (!useAuth.getState().user) return;
        // Optimistic clear so the UI feels instant; the SSE chat.cleared event
        // will reconcile if anything diverges.
        set({ messages: [], pendingTools: {}, error: null });
        try {
            await api.clearMessages();
        } catch (err) {
            console.warn("[chat] clearHistory failed:", err);
            set({ error: err });
            // Best-effort recovery: pull whatever the server still has.
            await get().refresh();
        }
    },
}));

// Sync chat history with auth: refresh on sign-in, reset on sign-out.
useAuth.subscribe((state, prev) => {
    if (state.user && state.user !== prev.user) {
        useChat.getState().refresh();
    } else if (!state.user && prev.user) {
        useChat.getState().reset();
    }
});
