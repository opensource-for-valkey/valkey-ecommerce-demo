export function trackView(products = []) {
  products.forEach(p => {
    if (!p?.id) return;
    fetch('/api/events/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: p.id, categoryId: p.categoryId || null }),
    }).catch(() => {});
  });
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}
