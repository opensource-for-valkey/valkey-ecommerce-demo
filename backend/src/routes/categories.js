const express = require("express");
const { db } = require("../db");
const { serializeCategory } = require("../lib/serializers");

const router = express.Router();

// GET /api/categories  -> tree with children populated
router.get("/", (_req, res) => {
    const rows = db.prepare("SELECT * FROM categories ORDER BY parent_id, name").all();
    const byId = {};
    for (const row of rows) {
        byId[row.id] = serializeCategory(row);
    }
    const tree = [];
    for (const row of rows) {
        const node = byId[row.id];
        if (row.parent_id && byId[row.parent_id]) {
            byId[row.parent_id].children.push(node.id);
        }
        if (!row.parent_id) tree.push(node);
    }
    res.json({ categories: Object.values(byId), tree: tree.map((c) => c.id) });
});

// GET /api/categories/:id
router.get("/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(req.params.id);
    if (!row) {
        return res.status(404).json({
            error: "not_found",
            message: `Category ${req.params.id} not found`,
        });
    }
    const node = serializeCategory(row);
    node.children = db
        .prepare("SELECT id FROM categories WHERE parent_id = ?")
        .all(row.id)
        .map((r) => r.id);
    res.json(node);
});

// GET /api/categories/:id/products
router.get("/:id/products", (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const cat = db.prepare("SELECT id FROM categories WHERE id = ?").get(req.params.id);
    if (!cat) {
        return res.status(404).json({
            error: "not_found",
            message: `Category ${req.params.id} not found`,
        });
    }

    // Include products in direct child categories too, so /api/categories/<top>/products
    // returns everything beneath the parent.
    const childIds = db
        .prepare("SELECT id FROM categories WHERE parent_id = ?")
        .all(req.params.id)
        .map((r) => r.id);
    const ids = [req.params.id, ...childIds];
    const placeholders = ids.map(() => "?").join(",");

    const rows = db
        .prepare(
            `SELECT * FROM products
       WHERE category_id IN (${placeholders}) AND status = 'active'
       ORDER BY id DESC
       LIMIT ? OFFSET ?`
        )
        .all(...ids, limit, offset);

    const total = db
        .prepare(
            `SELECT COUNT(*) AS n FROM products
       WHERE category_id IN (${placeholders}) AND status = 'active'`
        )
        .get(...ids).n;

    const { serializeProduct } = require("../lib/serializers");
    res.json({
        total,
        limit,
        offset,
        results: rows.map(serializeProduct),
    });
});

module.exports = router;
