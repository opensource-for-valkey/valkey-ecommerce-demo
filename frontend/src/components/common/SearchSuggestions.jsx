// Lightweight autocomplete dropdown driven by /api/search/suggest.
//
// Wraps any search-form layout: render the input the page already has, plus
// this component below it. Pass the current query value, the input ref (used
// to position relative to it visually via CSS), and a callback for when the
// user picks a suggestion.

import React, { useEffect, useRef, useState } from "react";
import api from "../../api/client";

export default function SearchSuggestions({ query, onPick, theme = "main" }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setItems([]);
      return;
    }

    const controller = new AbortController();
    const t = setTimeout(() => {
      api
        .suggest({ q, limit: 8 }, { signal: controller.signal })
        .then((data) => {
          setItems(data.suggestions || []);
          setOpen(true);
        })
        .catch((err) => {
          if (err.name !== "AbortError") setItems([]);
        });
    }, 150); // debounce

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!open || items.length === 0) return null;

  const accent =
    theme === "two" ? "hover-bg-main-two-50" : "hover-bg-main-50";

  return (
    <div
      ref={wrapRef}
      className="search-suggestions position-absolute bg-white border border-gray-100 rounded-8 mt-4 w-100 shadow-sm"
      style={{ top: "100%", left: 0, zIndex: 50, maxHeight: 320, overflowY: "auto" }}
    >
      <ul className="list-unstyled mb-0">
        {items.map((s) => (
          <li key={`${s.name}|${s.brand || ""}`}>
            <button
              type="button"
              className={`btn btn-link w-100 text-start text-gray-900 px-16 py-10 ${accent}`}
              style={{ textDecoration: "none" }}
              onClick={() => {
                setOpen(false);
                onPick(s.name);
              }}
            >
              <span className="d-block text-sm fw-medium">{s.name}</span>
              {s.brand && (
                <span className="d-block text-xs text-gray-500">{s.brand}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
