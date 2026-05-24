// Helpers for turning API payloads into display-ready values.
//
// Backend prices follow the HACKATHON.md contract: integer minor units of the
// currency (paise for INR). Convert to a major-unit string for the UI.

export function formatPrice(amount, currency = "INR") {
    if (amount == null || Number.isNaN(amount)) return "";
    const major = amount / 100;
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: major % 1 === 0 ? 0 : 2,
        }).format(major);
    } catch {
        return `${currency} ${major.toFixed(2)}`;
    }
}

// Pick the primary product image, with a graceful fallback to the bundled
// theme placeholders so cards never render a broken thumbnail.
export function productThumbnail(product, fallbackIndex = 1) {
    const imgs = Array.isArray(product?.images) ? product.images : [];
    const primary = imgs.find((i) => i.isPrimary) || imgs[0];
    const url = primary?.url;
    if (url && !url.startsWith("/assets/images/product/")) return url;
    const seed = encodeURIComponent(product?.id ?? `product-${fallbackIndex}`);
    return `https://picsum.photos/seed/${seed}/400/400`;
}

export function ratingLabel(ratings) {
    if (!ratings) return { avg: "0.0", count: "0" };
    const count = ratings.count ?? 0;
    const compact = count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${count}`;
    return { avg: (ratings.average ?? 0).toFixed(1), count: compact };
}
