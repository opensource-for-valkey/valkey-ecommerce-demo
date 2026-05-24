export const FALLBACK_IMAGE = "assets/images/commerce/product-fallback.png";

export const imageUrl = (src) => {
  const value = src || FALLBACK_IMAGE;
  if (/^(https?:|data:|blob:)/.test(value)) return value;
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = value.startsWith("/") ? value.slice(1) : value;
  return `${normalizedBase}${normalizedPath}`;
};
