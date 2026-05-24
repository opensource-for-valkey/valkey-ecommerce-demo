import { useEffect } from "react";

export const useSeo = (title, description) => {
  useEffect(() => {
    document.title = title ? `${title} | VAL-HYD` : "VAL-HYD";
    const meta =
      document.querySelector('meta[name="description"]') ||
      document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      description ||
        "A Valkey-powered ecommerce platform with fast search, cart caching, recommendations, and admin analytics."
    );
    document.head.appendChild(meta);
  }, [title, description]);
};
