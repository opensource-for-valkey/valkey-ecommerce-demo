// Image URL helpers. We resolve product images on the backend (loremflickr →
// Unsplash → picsum), so the frontend mostly just needs sizing/srcSet.

const FALLBACK = "/assets/images/thumbs/product-img1.png";

function isUnsplash(url) {
  return typeof url === "string" && url.includes("images.unsplash.com");
}
function isPicsum(url) {
  return typeof url === "string" && /(picsum\.photos|fastly\.picsum\.photos)/.test(url);
}
function isFlickr(url) {
  return typeof url === "string" && url.includes("loremflickr.com");
}
function isAbsolute(url) {
  return typeof url === "string" && /^https?:\/\//.test(url);
}

export function sized(url, w = 600) {
  if (!url) return FALLBACK;
  if (isUnsplash(url)) {
    try {
      const u = new URL(url);
      u.searchParams.set("w", String(w));
      u.searchParams.set("q", "80");
      u.searchParams.set("fm", "webp");
      return u.toString();
    } catch { return url; }
  }
  if (isPicsum(url)) {
    // picsum URLs are /seed/<seed>/<w>/<h> — swap both dimensions.
    return url.replace(/\/(\d+)\/(\d+)(\.jpg)?(\?.*)?$/, (_m, _w, _h, ext, q) =>
      `/${w}/${w}${ext || ""}${q || ""}`);
  }
  // loremflickr cache URLs are pre-resized; just return as-is.
  if (isFlickr(url)) return url;
  if (!isAbsolute(url)) {
    // Local placeholder under /assets — prefix with slash if missing.
    return url.startsWith("/") ? url : `/${url}`;
  }
  return url;
}

export function lqip(url, w = 24) {
  if (isUnsplash(url)) {
    try {
      const u = new URL(url);
      u.searchParams.set("w", String(w));
      u.searchParams.set("q", "20");
      u.searchParams.set("blur", "40");
      u.searchParams.set("fm", "webp");
      return u.toString();
    } catch { return null; }
  }
  if (isPicsum(url)) {
    return url.replace(/\/(\d+)\/(\d+)(\.jpg)?(\?.*)?$/, (_m, _w, _h, ext, q) =>
      `/${w}/${w}${ext || ""}${q || ""}`);
  }
  // No reliable LQIP path for loremflickr — return null, the component will
  // show a skeleton background instead.
  return null;
}

export function srcSet(url, w = 600) {
  if (!url) return undefined;
  if (!isUnsplash(url) && !isPicsum(url)) return undefined;
  return `${sized(url, w)} 1x, ${sized(url, w * 2)} 2x`;
}

export const placeholderImage = FALLBACK;
