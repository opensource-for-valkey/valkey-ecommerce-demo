// Renders the virtual AI cursor + a small label/caption. Reads state from
// useCursor; pure presentation otherwise.

import React from "react";
import { useCursor } from "../../store/cursor";

const SIZE = 32;
const LABEL_OFFSET = 24;

export default function AICursor() {
    const active = useCursor((s) => s.active);
    const x = useCursor((s) => s.x);
    const y = useCursor((s) => s.y);
    const label = useCursor((s) => s.label);
    const status = useCursor((s) => s.status);

    if (!active) return null;

    const cursorStyle = {
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${x - SIZE / 2}px, ${y - SIZE / 2}px)`,
        transition:
            status === "moving" ? "transform 700ms cubic-bezier(.2,.8,.2,1)" : "transform 200ms ease-out",
        pointerEvents: "none",
        zIndex: 2000,
        width: SIZE,
        height: SIZE,
    };

    const isPulsing = status === "clicking" || status === "highlighting";

    return (
        <>
            {/* Cursor glyph */}
            <div style={cursorStyle} aria-hidden="true">
                {/* Outer ring (pulses on click) */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0) 70%)",
                        animation: isPulsing ? "ai-cursor-ping 600ms ease-out" : "none",
                    }}
                />
                {/* Cursor core */}
                <svg
                    viewBox="0 0 24 24"
                    width={SIZE}
                    height={SIZE}
                    style={{
                        position: "absolute",
                        inset: 0,
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))",
                    }}
                >
                    <path
                        d="M5 3 L19 12 L12 13 L9 20 Z"
                        fill="#6366f1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Label */}
            {label && (
                <div
                    style={{
                        position: "fixed",
                        left: 0,
                        top: 0,
                        transform: `translate(${x + LABEL_OFFSET}px, ${y + LABEL_OFFSET}px)`,
                        transition: "transform 700ms cubic-bezier(.2,.8,.2,1)",
                        pointerEvents: "none",
                        zIndex: 2000,
                        background: "#1e1b4b",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 500,
                        maxWidth: 240,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    <span style={{ marginRight: 6, opacity: 0.7 }}>✦ AI</span>
                    {label}
                </div>
            )}

            {/* Inline keyframes + target pulse style. Scoped via a single
                <style> tag so we don't have to wire up CSS modules. */}
            <style>{`
                @keyframes ai-cursor-ping {
                    0%   { transform: scale(0.6); opacity: 1; }
                    100% { transform: scale(2.6); opacity: 0; }
                }
                .ai-target-pulse {
                    box-shadow: 0 0 0 0 rgba(99,102,241,0.7);
                    animation: ai-target-glow 600ms ease-out;
                    position: relative;
                    z-index: 5;
                }
                @keyframes ai-target-glow {
                    0%   { box-shadow: 0 0 0 0   rgba(99,102,241,0.7); }
                    70%  { box-shadow: 0 0 0 14px rgba(99,102,241,0);   }
                    100% { box-shadow: 0 0 0 0   rgba(99,102,241,0);   }
                }
            `}</style>
        </>
    );
}
