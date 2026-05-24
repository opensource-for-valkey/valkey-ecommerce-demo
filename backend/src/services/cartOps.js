// Cart mutation helpers shared by the REST routes and the agent's tools.
// Every mutation reloads the cart and broadcasts a cart.updated event so all
// devices stay in sync.

const { db } = require("../db");
const bus = require("../lib/bus");
const { nowIso } = require("../lib/auth");
const { loadCart } = require("./cart");

const findProduct = db.prepare("SELECT * FROM products WHERE id = ?");
const upsertItem = db.prepare(
    `INSERT INTO cart_items (user_id, product_id, quantity, status, added_at, updated_at)
   VALUES (@user_id, @product_id, @quantity, @status, @added_at, @updated_at)
   ON CONFLICT(user_id, product_id) DO UPDATE SET
     quantity   = cart_items.quantity + excluded.quantity,
     status     = excluded.status,
     updated_at = excluded.updated_at`
);
const setItemStatus = db.prepare(
    `UPDATE cart_items
      SET status = ?, updated_at = ?
    WHERE user_id = ? AND product_id = ?`
);
const updateItem = db.prepare(
    `UPDATE cart_items
      SET quantity = COALESCE(?, quantity),
          status   = COALESCE(?, status),
          updated_at = ?
    WHERE user_id = ? AND product_id = ?`
);
const deleteItem = db.prepare(
    "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?"
);
const deleteAll = db.prepare("DELETE FROM cart_items WHERE user_id = ?");

async function broadcastCart(userId, source) {
    const cart = loadCart(userId);
    await bus.publish(bus.userChannel(userId), {
        type: "cart.updated",
        source,
        cart,
        at: nowIso(),
    });
    return cart;
}

async function addItem(userId, { productId, quantity = 1, status = "active" }, source = "user") {
    if (!findProduct.get(productId)) {
        return { ok: false, error: "not_found" };
    }
    const now = nowIso();
    upsertItem.run({
        user_id: userId,
        product_id: productId,
        quantity,
        status,
        added_at: now,
        updated_at: now,
    });
    const cart = await broadcastCart(userId, source);
    return { ok: true, cart };
}

async function patchItem(userId, productId, { quantity, status }, source = "user") {
    const result = updateItem.run(
        quantity ?? null,
        status ?? null,
        nowIso(),
        userId,
        productId
    );
    if (result.changes === 0) return { ok: false, error: "not_found" };
    const cart = await broadcastCart(userId, source);
    return { ok: true, cart };
}

async function setStatus(userId, productId, status, source = "user") {
    const result = setItemStatus.run(status, nowIso(), userId, productId);
    if (result.changes === 0) return { ok: false, error: "not_found" };
    const cart = await broadcastCart(userId, source);
    return { ok: true, cart };
}

async function removeItem(userId, productId, source = "user") {
    const result = deleteItem.run(userId, productId);
    if (result.changes === 0) return { ok: false, error: "not_found" };
    const cart = await broadcastCart(userId, source);
    return { ok: true, cart };
}

async function clearCart(userId, source = "user") {
    deleteAll.run(userId);
    const cart = await broadcastCart(userId, source);
    return { ok: true, cart };
}

module.exports = {
    addItem,
    patchItem,
    setStatus,
    removeItem,
    clearCart,
    broadcastCart,
};
