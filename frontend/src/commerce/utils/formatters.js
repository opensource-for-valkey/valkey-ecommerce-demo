export const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value || 0));

export const statusLabel = (status) => String(status || "").replaceAll("_", " ");

export const discountPercent = (product) =>
  product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

