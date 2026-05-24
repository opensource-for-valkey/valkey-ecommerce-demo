import React, { useEffect, useRef, useState } from "react";

// Lightweight suggestions dropdown for the always-on header search input.
// Pulls from /api/agent/suggestions (Valkey-backed: popular ZSET + per-session
// LIST + cached product-term SET). Keyboard navigable: ↑/↓ to move, Enter to
// pick, Esc to close. Submitting still navigates to /search?q=<value>.

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api/agent";

const KIND_ICON = {
  recent: "ph-clock-counter-clockwise",
  popular: "ph-trend-up",
  product: "ph-magnifying-glass",
};

const KIND_LABEL = {
  recent: "Recent",
  popular: "Popular",
  product: "Catalogue",
};

function getOrCreateSid() {
  let sid = localStorage.getItem("agent_sid");
  if (!sid) {
    sid = `web_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("agent_sid", sid);
  }
  return sid;
}

const SearchSuggestions = ({ value, open, onPick, onClose }) => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(-1);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const sid = getOrCreateSid();
      const url = `${API_URL}/suggestions?q=${encodeURIComponent(value || "")}&sessionId=${encodeURIComponent(sid)}&limit=8`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        setItems(j.items || []);
        setActive(-1);
      } catch {
        setItems([]);
      }
    }, 120);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [value, open]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min((items.length || 1) - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(-1, i - 1));
      } else if (e.key === "Enter" && active >= 0 && items[active]) {
        e.preventDefault();
        onPick?.(items[active].label);
      } else if (e.key === "Escape") {
        onClose?.();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, items, active, onPick, onClose]);

  if (!open || items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="search-suggestions"
      role="listbox"
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 1000,
        marginTop: 6,
        background: "#fff",
        border: "1px solid #e6e6e6",
        boxShadow: "0 12px 24px rgba(0,0,0,0.10)",
        borderRadius: 8,
        maxHeight: 360,
        overflowY: "auto",
        padding: 4,
      }}
    >
      {items.map((it, idx) => (
        <button
          key={`${it.kind}-${it.label}`}
          type="button"
          role="option"
          aria-selected={idx === active}
          onMouseEnter={() => setActive(idx)}
          onMouseDown={(e) => { e.preventDefault(); onPick?.(it.label); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "10px 12px",
            border: "none",
            background: idx === active ? "rgba(90,30,34,0.06)" : "transparent",
            borderRadius: 6,
            textAlign: "left",
            cursor: "pointer",
            color: "#1a0a0c",
            fontFamily: "inherit",
          }}
        >
          <i className={`ph ${KIND_ICON[it.kind] || "ph-magnifying-glass"}`} style={{ color: "#8E7042" }} />
          <span style={{ flex: 1 }}>{it.label}</span>
          <small style={{ color: "#8E7042", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
            {KIND_LABEL[it.kind] || ""}
          </small>
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;
