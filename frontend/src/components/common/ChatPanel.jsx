// Floating shopping-assistant panel. Mounted once at the app root. Reads the
// agent transcript from `useChat`, sends user messages through the Zustand
// `send` action, and renders tool calls as compact "searching…" badges.
//
// The chat is auth-gated: signed-out users see a sign-in prompt instead.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { useChat } from "../../store/chat";

const TOOL_LABELS = {
    search_products: "Searching catalog",
    get_product: "Looking up product",
    check_stock: "Checking stock",
};

function MessageBubble({ message }) {
    if (!message.content) return null;
    if (message.role === "user") {
        return (
            <div className="d-flex justify-content-end mb-12">
                <div
                    className="bg-main-600 text-white rounded-16 px-16 py-12 text-sm"
                    style={{ maxWidth: "80%", whiteSpace: "pre-wrap" }}
                >
                    {message.content}
                </div>
            </div>
        );
    }
    if (message.role === "assistant") {
        return (
            <div className="d-flex justify-content-start mb-12">
                <div
                    className="bg-gray-50 text-gray-900 rounded-16 px-16 py-12 text-sm"
                    style={{ maxWidth: "85%", whiteSpace: "pre-wrap" }}
                >
                    {message.content}
                </div>
            </div>
        );
    }
    return null;
}

function ToolBadge({ name, status }) {
    const label = TOOL_LABELS[name] || name;
    return (
        <div className="d-flex justify-content-start mb-12">
            <div className="bg-main-50 text-main-600 rounded-pill px-12 py-4 text-xs fw-medium d-inline-flex align-items-center gap-6">
                <i className={`ph ${status === "done" ? "ph-check-circle" : "ph-magnifying-glass"}`} />
                {label}
                {status === "running" && <span className="dots">…</span>}
            </div>
        </div>
    );
}

export default function ChatPanel() {
    const user = useAuth((s) => s.user);
    const open = useChat((s) => s.open);
    const sending = useChat((s) => s.sending);
    const messages = useChat((s) => s.messages);
    const pendingTools = useChat((s) => s.pendingTools);
    const error = useChat((s) => s.error);
    const toggle = useChat((s) => s.toggle);
    const send = useChat((s) => s.send);
    const clearHistory = useChat((s) => s.clearHistory);

    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    // Renderable timeline: assistant tool_calls become inline badges right
    // before the assistant turn that issued them so the UI shows the agent's
    // reasoning in order.
    const timeline = useMemo(() => {
        const items = [];
        const seenToolResults = new Set();

        for (const m of messages) {
            if (m.role === "tool") {
                seenToolResults.add(m.toolCallId);
                continue;
            }
            if (m.role === "assistant" && Array.isArray(m.toolCalls)) {
                for (const call of m.toolCalls) {
                    items.push({
                        kind: "tool",
                        key: `tool-${call.id}`,
                        name: call.function?.name,
                        status: seenToolResults.has(call.id) ? "done" : "running",
                    });
                }
            }
            if (m.content) {
                items.push({ kind: "msg", key: `msg-${m.id}`, message: m });
            }
        }

        // Tool calls the agent emitted via SSE but that haven't been folded
        // into an assistant message yet (race window between chat.tool_call
        // and chat.message persistence).
        for (const id of Object.keys(pendingTools)) {
            const t = pendingTools[id];
            if (!items.find((i) => i.kind === "tool" && i.key.endsWith(id))) {
                items.push({
                    kind: "tool",
                    key: `pending-${id}`,
                    name: t.name,
                    status: "running",
                });
            }
        }

        return items;
    }, [messages, pendingTools]);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [timeline.length, sending]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;
        const text = input;
        setInput("");
        await send(text);
    };

    const handleClear = async () => {
        if (sending) return;
        if (messages.length === 0 && Object.keys(pendingTools).length === 0) return;
        const ok = window.confirm("Clear the entire chat history? This cannot be undone.");
        if (!ok) return;
        await clearHistory();
    };

    const canClear = !!user && !sending &&
        (messages.length > 0 || Object.keys(pendingTools).length > 0);

    return (
        <>
            {/* Floating launcher */}
            <button
                type="button"
                onClick={toggle}
                className="btn bg-main-600 text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                aria-label={open ? "Close shopping assistant" : "Open shopping assistant"}
                style={{
                    position: "fixed",
                    right: 24,
                    bottom: 24,
                    width: 56,
                    height: 56,
                    zIndex: 1040,
                }}
            >
                <i className={`ph ${open ? "ph-x" : "ph-sparkle"} text-2xl`} />
            </button>

            {open && (
                <div
                    className="bg-white border border-gray-100 rounded-16 shadow-lg d-flex flex-column"
                    style={{
                        position: "fixed",
                        right: 24,
                        bottom: 92,
                        width: "min(380px, calc(100vw - 48px))",
                        height: "min(560px, calc(100vh - 140px))",
                        zIndex: 1040,
                        overflow: "hidden",
                    }}
                >
                    <header className="px-16 py-12 border-bottom border-gray-100 d-flex align-items-center gap-8">
                        <span className="w-32 h-32 rounded-circle bg-main-50 text-main-600 d-flex align-items-center justify-content-center">
                            <i className="ph-fill ph-sparkle" />
                        </span>
                        <div className="flex-grow-1">
                            <div className="text-md fw-semibold text-gray-900">Shopping assistant</div>
                            <div className="text-xs text-gray-500">
                                {user ? "Powered by Groq + Valkey" : "Sign in to chat"}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={!canClear}
                            className="btn btn-link text-gray-500 p-0"
                            title="Clear chat history"
                            aria-label="Clear chat history"
                            style={{ opacity: canClear ? 1 : 0.4 }}
                        >
                            <i className="ph ph-trash text-lg" />
                        </button>
                        <button
                            type="button"
                            onClick={toggle}
                            className="btn btn-link text-gray-500 p-0"
                            aria-label="Close"
                        >
                            <i className="ph ph-x text-lg" />
                        </button>
                    </header>

                    <div
                        ref={scrollRef}
                        className="flex-grow-1 px-16 py-16"
                        style={{ overflowY: "auto", background: "#fafafa" }}
                    >
                        {!user ? (
                            <div className="text-center text-gray-500 mt-32">
                                <p className="mb-12">Sign in to start a conversation.</p>
                                <Link to="/account" className="btn btn-main btn-sm">Sign in</Link>
                            </div>
                        ) : timeline.length === 0 ? (
                            <div className="text-center text-gray-500 mt-32">
                                <p className="mb-8 text-sm">Try asking:</p>
                                <ul className="list-unstyled text-sm">
                                    <li className="mb-6">"Find me a yoga mat under ₹1500"</li>
                                    <li className="mb-6">"Show me Samsung phones in stock"</li>
                                    <li>"What's a good gift around ₹3000?"</li>
                                </ul>
                            </div>
                        ) : (
                            timeline.map((item) =>
                                item.kind === "tool" ? (
                                    <ToolBadge key={item.key} name={item.name} status={item.status} />
                                ) : (
                                    <MessageBubble key={item.key} message={item.message} />
                                )
                            )
                        )}
                        {sending && (
                            <div className="d-flex justify-content-start">
                                <div className="bg-gray-50 text-gray-500 rounded-16 px-16 py-12 text-sm">
                                    <span className="dots">Thinking…</span>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="text-danger-600 text-xs mt-8">
                                {error.message || "Something went wrong"}
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="px-12 py-12 border-top border-gray-100 d-flex align-items-center gap-8"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={user ? "Ask me anything…" : "Sign in to chat"}
                            disabled={!user || sending}
                            className="form-control common-input rounded-pill px-16"
                            style={{ height: 40 }}
                        />
                        <button
                            type="submit"
                            disabled={!user || sending || !input.trim()}
                            className="btn bg-main-600 text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40 }}
                            aria-label="Send"
                        >
                            <i className="ph ph-paper-plane-tilt" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
