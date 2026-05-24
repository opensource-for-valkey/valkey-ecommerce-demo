const express = require("express");
const { db } = require("../db");
const { serializeVendor, serializeProduct } = require("../lib/serializers");

const router = express.Router();

// GET /api/vendors
router.get("/", (_req, res) => {
    const rows = db.prepare("SELECT * FROM vendors ORDER BY name ASC").all();
    res.json({ results: rows.map(serializeVendor) });
});

// GET /api/vendors/:id
router.get("/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM vendors WHERE id = ?").get(req.params.id);
    if (!row) {
        return res.status(404).json({
            error: "not_found",
            message: `Vendor ${req.params.id} not found`,
        });
    }

    const counts = db
        .prepare(
            "SELECT COUNT(*) AS total FROM products WHERE vendor_id = ? AND status = 'active'"
        )
        .get(row.id);

    res.json({ ...serializeVendor(row), totalProducts: counts.total });
});

// GET /api/vendors/:id/products
router.get("/:id/products", (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const vendor = db.prepare("SELECT id FROM vendors WHERE id = ?").get(req.params.id);
    if (!vendor) {
        return res.status(404).json({
            error: "not_found",
            message: `Vendor ${req.params.id} not found`,
        });
    }

    const rows = db
        .prepare(
            `SELECT * FROM products
       WHERE vendor_id = ? AND status = 'active'
       ORDER BY id DESC
       LIMIT ? OFFSET ?`
        )
        .all(req.params.id, limit, offset);

    const total = db
        .prepare(
            "SELECT COUNT(*) AS n FROM products WHERE vendor_id = ? AND status = 'active'"
        )
        .get(req.params.id).n;

    res.json({
        total,
        limit,
        offset,
        results: rows.map(serializeProduct),
    });
});

module.exports = router;
