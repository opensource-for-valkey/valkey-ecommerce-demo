// Search endpoints.
//
//   GET /api/search                  — keyword search with facets
//   GET /api/search/suggest          — autocomplete
//   GET /api/search/semantic         — vector similarity (Valkey-backed)
//
// The keyword path is intentionally simple LIKE matching. Semantic search
// embeds the query and ranks by cosine similarity over the Valkey-stored
// vectors, then joins with SQLite for the rest of the product fields.

const express = require("express");
const { db } = require("../db");
const { serializeProduct } = require("../lib/serializers");
const semanticSearch = require("../services/semanticSearch");

const router = express.Router();

function tokenize(q) {
    return String(q || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 8); // bound the query
}

// GET /api/search?q=&category=&minPrice=&maxPrice=&sort=&page=&pageSize=
router.get("/", (req, res) => {
    const q = String(req.query.q || "").trim();
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const offset = (page - 1) * pageSize;

    const where = ["status = 'active'"];
    const params = [];

    for (const token of tokenize(q)) {
        where.push(
            "(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(sku) LIKE ? OR LOWER(tags) LIKE ?)"
        );
        const pat = `%${token}%`;
        params.push(pat, pat, pat, pat, pat);
    }
    if (req.query.category) {
        where.push("category_id = ?");
        params.push(req.query.category);
    }
    if (req.query.minPrice) {
        where.push("price_amount >= ?");
        params.push(parseInt(req.query.minPrice, 10));
    }
    if (req.query.maxPrice) {
        where.push("price_amount <= ?");
        params.push(parseInt(req.query.maxPrice, 10));
    }

    const sortMap = {
        relevance: "id DESC",
        newest: "id DESC",
        price_asc: "price_amount ASC",
        price_desc: "price_amount DESC",
        rating: "ratings_average DESC, ratings_count DESC",
    };
    const orderBy = sortMap[req.query.sort] || "ratings_average DESC, id DESC";

    const whereSql = where.join(" AND ");
    const rows = db
        .prepare(
            `SELECT * FROM products WHERE ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
        )
        .all(...params, pageSize, offset);

    const total = db
        .prepare(`SELECT COUNT(*) AS n FROM products WHERE ${whereSql}`)
        .get(...params).n;

    const brandRows = db
        .prepare(
            `SELECT brand AS name, COUNT(*) AS count
               FROM products WHERE ${whereSql}
               GROUP BY brand
               ORDER BY count DESC, brand ASC
               LIMIT 10`
        )
        .all(...params);

    const joinedWhere = where
        .map((clause) =>
            clause.replace(
                /(\b)(name|description|brand|sku|tags|status|category_id|price_amount)\b/g,
                "$1p.$2"
            )
        )
        .join(" AND ");
    const categoryRows = db
        .prepare(
            `SELECT p.category_id AS id, c.name AS name, COUNT(*) AS count
               FROM products p
               JOIN categories c ON c.id = p.category_id
               WHERE ${joinedWhere}
               GROUP BY p.category_id, c.name
               ORDER BY count DESC
               LIMIT 10`
        )
        .all(...params);

    res.json({
        query: q,
        total,
        page,
        pageSize,
        results: rows.map(serializeProduct),
        facets: { brands: brandRows, categories: categoryRows },
    });
});

// GET /api/search/suggest?q=gal&limit=8
router.get("/suggest", (req, res) => {
    const q = String(req.query.q || "").trim().toLowerCase();
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 20);
    if (!q) return res.json({ query: q, suggestions: [] });

    const pat = `%${q}%`;
    const prefix = `${q}%`;
    const rows = db
        .prepare(
            `SELECT name, brand, ratings_count
               FROM products
               WHERE status = 'active'
                 AND (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(tags) LIKE ?)
               ORDER BY
                 CASE WHEN LOWER(name) LIKE ? THEN 0 ELSE 1 END,
                 ratings_count DESC
               LIMIT ?`
        )
        .all(pat, pat, pat, prefix, limit);

    const seen = new Set();
    const suggestions = [];
    for (const r of rows) {
        const key = r.name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        suggestions.push({ name: r.name, brand: r.brand });
    }
    res.json({ query: q, suggestions });
});

// GET /api/search/semantic?q=&categoryId=&minPrice=&maxPrice=&k=
router.get("/semantic", async (req, res, next) => {
    const q = String(req.query.q || "").trim();
    if (!q) {
        return res.status(400).json({
            error: "invalid_request",
            message: "q is required",
        });
    }
    try {
        const k = Math.min(parseInt(req.query.k, 10) || 6, 20);
        const result = await semanticSearch.search(q, {
            k,
            filters: {
                categoryId: req.query.categoryId,
                minPrice: req.query.minPrice ? parseInt(req.query.minPrice, 10) : undefined,
                maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice, 10) : undefined,
            },
        });
        res.json(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
