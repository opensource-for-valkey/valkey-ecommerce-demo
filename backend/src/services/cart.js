// Cart service. Pure read helper used by both the REST routes and the SSE
// snapshot. Keeping this in one place means future Valkey-backed reads (e.g.
// HGETALL cart:user:<id>) can be swapped here without touching call sites.

const { db } = require("../db");
const { serializeProduct } = require("../lib/serializers");

const listItems = db.prepare(
    `SELECT product_id, quantity, status, added_at, updated_at
     FROM cart_items
    WHERE user_id = ?
    ORDER BY added_at ASC`
);

function loadCart(userId) {
    const rows = listItems.all(userId);
    if (rows.length === 0) {
        return { items: [], subtotal: 0, currency: "INR", count: 0 };
    }

    const ids = rows.map((r) => r.product_id);
    const placeholders = ids.map(() => "?").join(",");
    const products = db
        .prepare(`SELECT * FROM products WHERE id IN (${placeholders})`)
        .all(...ids);
    const byId = Object.fromEntries(products.map((p) => [p.id, p]));

    const items = rows
        .map((r) => {
            const product = byId[r.product_id];
            if (!product) return null;
            const lineTotal = product.price_amount * r.quantity;
            return {
                productId: r.product_id,
                quantity: r.quantity,
                status: r.status,
                addedAt: r.added_at,
                updatedAt: r.updated_at,
                lineTotal,
                product: serializeProduct(product),
            };
        })
        .filter(Boolean);

    const active = items.filter((i) => i.status === "active");
    const subtotal = active.reduce((acc, i) => acc + i.lineTotal, 0);
    const currency = items[0]?.product.price?.currency || "INR";
    const count = active.reduce((acc, i) => acc + i.quantity, 0);

    return { items, subtotal, currency, count };
}

module.exports = { loadCart };
