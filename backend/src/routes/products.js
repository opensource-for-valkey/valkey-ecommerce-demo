const express = require("express");
const { db } = require("../db");
const { serializeProduct } = require("../lib/serializers");

const router = express.Router();

// GET /api/products
//   ?categoryId=&vendorId=&brand=&minPrice=&maxPrice=&q=&sort=&limit=&offset=
router.get("/", (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const where = ["status = 'active'"];
    const params = [];

    if (req.query.categoryId) {
        where.push("category_id = ?");
        params.push(req.query.categoryId);
    }
    if (req.query.vendorId) {
        where.push("vendor_id = ?");
        params.push(req.query.vendorId);
    }
    if (req.query.brand) {
        where.push("LOWER(brand) = LOWER(?)");
        params.push(req.query.brand);
    }
    if (req.query.minPrice) {
        where.push("price_amount >= ?");
        params.push(parseInt(req.query.minPrice, 10));
    }
    if (req.query.maxPrice) {
        where.push("price_amount <= ?");
        params.push(parseInt(req.query.maxPrice, 10));
    }
    if (req.query.q) {
        // Tokenize on whitespace and AND each token across name/description/brand/sku/tags.
        // Deliberately simple "good enough" search until we move to Valkey + FT.SEARCH
        // per HACKATHON.md.
        const tokens = String(req.query.q)
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 8); // hard cap to keep the query bounded
        for (const token of tokens) {
            where.push(
                "(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(sku) LIKE ? OR LOWER(tags) LIKE ?)"
            );
            const pat = `%${token}%`;
            params.push(pat, pat, pat, pat, pat);
        }
    }

    const sortMap = {
        newest: "id DESC",
        oldest: "id ASC",
        price_asc: "price_amount ASC",
        price_desc: "price_amount DESC",
        rating: "ratings_average DESC, ratings_count DESC",
    };
    const orderBy = sortMap[req.query.sort] || "id DESC";

    const whereSql = where.join(" AND ");
    const rows = db
        .prepare(
            `SELECT * FROM products WHERE ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
        )
        .all(...params, limit, offset);

    const total = db
        .prepare(`SELECT COUNT(*) AS n FROM products WHERE ${whereSql}`)
        .get(...params).n;

    res.json({
        total,
        limit,
        offset,
        results: rows.map(serializeProduct),
    });
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    if (!row) {
        return res.status(404).json({
            error: "not_found",
            message: `Product ${req.params.id} not found`,
        });
    }
    res.json(serializeProduct(row));
});

module.exports = router;
