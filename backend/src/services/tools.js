// Tool registry for the shopping agent. Each tool has:
//   - schema:  the JSON schema we send to Groq (OpenAI-compatible function tools)
//   - execute: server-side handler. Receives (args, ctx) where ctx = { userId }.
//
// Phase 3 shipped read-only data tools (search, get, check stock).
// Phase 4 adds UI/state tools that mutate the shared session and broadcast
// `ui.command` events the frontend interprets as a virtual AI cursor.

const { db } = require("../db");
const { serializeProduct } = require("../lib/serializers");
const cartOps = require("./cartOps");
const ui = require("./ui");
const semanticSearch = require("./semanticSearch");

// ----------------------------- helpers ---------------------------------

function formatRupees(paise) {
    if (paise == null || Number.isNaN(paise)) return null;
    const rupees = paise / 100;
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    }).format(rupees);
}

function withDisplayPrice(p) {
    return {
        ...p,
        priceDisplay: formatRupees(p.price?.amount),
        compareAtDisplay: p.price?.compareAt ? formatRupees(p.price.compareAt) : null,
    };
}

function bound(value, min, max, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}

function tokenize(q) {
    return String(q || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 8);
}

// Sleep so successive UI commands can be played back as a sequence.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ============================================================
//                   READ-ONLY DATA TOOLS
// ============================================================

const searchProductsSchema = {
    type: "function",
    function: {
        name: "search_products",
        description:
            "Search the product catalog. Combine free-text with optional price/category filters. Returns trimmed product summaries with priceDisplay already formatted as ₹X,XXX.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Free-text query, e.g. 'silver pendant necklace'. Tokens are ANDed across name/description/brand/sku/tags.",
                },
                categoryId: {
                    type: "string",
                    description: "Optional category id (format `category:<uuid>`).",
                },
                minPrice: { type: "integer", description: "Lower bound in paise (₹100 = 10000)." },
                maxPrice: { type: "integer", description: "Upper bound in paise." },
                sort: {
                    type: "string",
                    enum: ["newest", "rating", "price_asc", "price_desc"],
                    description: "Result ordering. Default: rating.",
                },
                limit: { type: "integer", minimum: 1, maximum: 12, description: "Max results (default 6)." },
            },
        },
    },
};

function executeSearchProducts(args = {}) {
    const where = ["status = 'active'"];
    const params = [];

    for (const tok of tokenize(args.query)) {
        where.push(
            "(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(sku) LIKE ? OR LOWER(tags) LIKE ?)"
        );
        const pat = `%${tok}%`;
        params.push(pat, pat, pat, pat, pat);
    }
    if (args.categoryId) {
        where.push("category_id = ?");
        params.push(args.categoryId);
    }
    if (args.minPrice != null) {
        where.push("price_amount >= ?");
        params.push(args.minPrice);
    }
    if (args.maxPrice != null) {
        where.push("price_amount <= ?");
        params.push(args.maxPrice);
    }

    const sortMap = {
        rating: "ratings_average DESC, ratings_count DESC",
        newest: "id DESC",
        price_asc: "price_amount ASC",
        price_desc: "price_amount DESC",
    };
    const orderBy = sortMap[args.sort] || sortMap.rating;
    const limit = bound(args.limit, 1, 12, 6);

    const rows = db
        .prepare(
            `SELECT * FROM products WHERE ${where.join(" AND ")} ORDER BY ${orderBy} LIMIT ?`
        )
        .all(...params, limit);

    return {
        total: rows.length,
        results: rows.map((r) => {
            const p = serializeProduct(r);
            return withDisplayPrice({
                id: p.id,
                name: p.name,
                brand: p.brand,
                sku: p.sku,
                categoryId: p.categoryId,
                price: p.price,
                ratings: p.ratings,
                inventoryAvailable: Math.max(
                    0,
                    (p.inventory?.quantity ?? 0) - (p.inventory?.reserved ?? 0)
                ),
                tags: p.tags,
                shortDescription: p.shortDescription,
            });
        }),
    };
}

const getProductSchema = {
    type: "function",
    function: {
        name: "get_product",
        description: "Look up full details for a specific product by id.",
        parameters: {
            type: "object",
            required: ["productId"],
            properties: {
                productId: { type: "string", description: "`product:<uuid>`" },
            },
        },
    },
};

function executeGetProduct(args = {}) {
    const row = db.prepare("SELECT * FROM products WHERE id = ?").get(args.productId);
    if (!row) return { error: "not_found", productId: args.productId };
    return { product: withDisplayPrice(serializeProduct(row)) };
}

const checkStockSchema = {
    type: "function",
    function: {
        name: "check_stock",
        description: "Check live inventory for a product.",
        parameters: {
            type: "object",
            required: ["productId"],
            properties: {
                productId: { type: "string", description: "`product:<uuid>`" },
            },
        },
    },
};

function executeCheckStock(args = {}) {
    const row = db
        .prepare(
            `SELECT id, name, inventory_quantity, inventory_reserved, status
         FROM products WHERE id = ?`
        )
        .get(args.productId);
    if (!row) return { error: "not_found", productId: args.productId };
    const available = Math.max(0, row.inventory_quantity - row.inventory_reserved);
    return {
        productId: row.id,
        name: row.name,
        inStock: available > 0 && row.status === "active",
        available,
        reserved: row.inventory_reserved,
    };
}

// -------------------------------- semantic_search
const semanticSearchSchema = {
    type: "function",
    function: {
        name: "semantic_search",
        description:
            "Find products by *meaning* using vector similarity. Use this when the shopper's query is descriptive or conceptual ('something to keep my coffee warm', 'minimalist gift for a tech person') rather than a specific product name. Returns the top matches with priceDisplay and a similarity score in [0, 1].",
        parameters: {
            type: "object",
            required: ["query"],
            properties: {
                query: {
                    type: "string",
                    description: "Natural-language description of what the shopper wants.",
                },
                categoryId: { type: "string", description: "Optional category filter." },
                minPrice: { type: "integer", description: "Lower bound in paise." },
                maxPrice: { type: "integer", description: "Upper bound in paise." },
                k: { type: "integer", minimum: 1, maximum: 12, description: "Max results (default 5)." },
            },
        },
    },
};

async function executeSemanticSearch(args = {}) {
    const k = bound(args.k, 1, 12, 5);
    const result = await semanticSearch.search(args.query, {
        k,
        filters: {
            categoryId: args.categoryId,
            minPrice: args.minPrice,
            maxPrice: args.maxPrice,
        },
    });
    return {
        query: result.query,
        model: result.model,
        total: result.total,
        warning: result.warning,
        results: result.results.map((p) =>
            withDisplayPrice({
                id: p.id,
                name: p.name,
                brand: p.brand,
                sku: p.sku,
                categoryId: p.categoryId,
                price: p.price,
                ratings: p.ratings,
                inventoryAvailable: Math.max(
                    0,
                    (p.inventory?.quantity ?? 0) - (p.inventory?.reserved ?? 0)
                ),
                tags: p.tags,
                shortDescription: p.shortDescription,
                score: Number(p.score?.toFixed?.(3) ?? p.score),
            })
        ),
    };
}

// ============================================================
//                  UI / STATE-MUTATING TOOLS
//   These emit ui.command events so the frontend plays the AI
//   cursor animation, then perform the underlying state change.
// ============================================================

const navigateSchema = {
    type: "function",
    function: {
        name: "navigate",
        description:
            "Navigate the user's browser to a different page. Allowed paths: /, /shop, /cart, /account. /shop accepts ?q=, ?categoryId= query strings.",
        parameters: {
            type: "object",
            required: ["path"],
            properties: {
                path: {
                    type: "string",
                    description: "Path with optional query string, e.g. '/shop?q=yoga' or '/cart'.",
                },
                why: {
                    type: "string",
                    description: "Short reason shown to the user, e.g. 'Opening the shop with your filter applied.'",
                },
            },
        },
    },
};

const ALLOWED_NAV_PATHS = new Set(["/", "/shop", "/cart", "/account", "/wishlist", "/checkout", "/product-details"]);

async function executeNavigate(args = {}, ctx) {
    const path = String(args.path || "").trim();
    const base = path.split("?")[0] || "/";
    if (!ALLOWED_NAV_PATHS.has(base)) {
        return { error: "blocked_path", message: `Path not allowed: ${base}` };
    }
    await ui.emit(ctx.userId, { action: "navigate", path, why: args.why });
    return { ok: true, path, why: args.why || null };
}

const applyFilterSchema = {
    type: "function",
    function: {
        name: "apply_filter",
        description:
            "Apply shop filters. Navigates to /shop with the requested filter query, and the cursor animation suggests the AI 'clicked' the filters.",
        parameters: {
            type: "object",
            properties: {
                q: { type: "string", description: "Free-text search to apply." },
                categoryId: { type: "string", description: "Category id." },
                minPrice: { type: "integer", description: "Lower bound in paise." },
                maxPrice: { type: "integer", description: "Upper bound in paise." },
                sort: {
                    type: "string",
                    enum: ["newest", "rating", "price_asc", "price_desc"],
                },
            },
        },
    },
};

async function executeApplyFilter(args = {}, ctx) {
    const params = new URLSearchParams();
    if (args.q) params.set("q", args.q);
    if (args.categoryId) params.set("categoryId", args.categoryId);
    if (args.minPrice != null) params.set("minPrice", String(args.minPrice));
    if (args.maxPrice != null) params.set("maxPrice", String(args.maxPrice));
    if (args.sort) params.set("sort", args.sort);

    const qs = params.toString();
    const path = qs ? `/shop?${qs}` : "/shop";
    await ui.emit(ctx.userId, {
        action: "navigate",
        path,
        why: "Applying the filters you asked for.",
    });
    return { ok: true, path, applied: args };
}

const openProductSchema = {
    type: "function",
    function: {
        name: "open_product",
        description: "Open a product detail page so the shopper can see it. The cursor flies to the product card and 'clicks'.",
        parameters: {
            type: "object",
            required: ["productId"],
            properties: {
                productId: { type: "string", description: "`product:<uuid>`" },
            },
        },
    },
};

async function executeOpenProduct(args = {}, ctx) {
    const row = db.prepare("SELECT id, name FROM products WHERE id = ?").get(args.productId);
    if (!row) return { error: "not_found", productId: args.productId };

    // First, click the card if visible on screen…
    await ui.emit(ctx.userId, {
        action: "click",
        target: `product-card:${row.id}`,
        why: `Opening ${row.name}`,
    });
    // …then navigate. The frontend treats `navigate` as the authoritative
    // route change; the click is just an animation for visual continuity.
    await sleep(900);
    await ui.emit(ctx.userId, {
        action: "navigate",
        path: `/product-details?id=${encodeURIComponent(row.id)}`,
    });
    return { ok: true, productId: row.id, name: row.name };
}

const highlightSchema = {
    type: "function",
    function: {
        name: "highlight",
        description: "Briefly highlight an element on the current page (e.g. a product card or the cart icon) to draw the user's attention.",
        parameters: {
            type: "object",
            required: ["target"],
            properties: {
                target: {
                    type: "string",
                    description: "data-ai-target value. Examples: 'product-card:<productId>', 'header-cart', 'shop-sidebar'.",
                },
                why: { type: "string" },
            },
        },
    },
};

async function executeHighlight(args = {}, ctx) {
    if (!args.target) return { error: "invalid_request", message: "target required" };
    await ui.emit(ctx.userId, {
        action: "highlight",
        target: args.target,
        why: args.why,
    });
    return { ok: true, target: args.target };
}

const addToCartSchema = {
    type: "function",
    function: {
        name: "add_to_cart",
        description:
            "Add a product to the user's cart. Plays an AI cursor click animation on the product's Add button, then performs the add. Use status='draft' when the user hasn't committed yet — they'll see it as a draft pick.",
        parameters: {
            type: "object",
            required: ["productId"],
            properties: {
                productId: { type: "string", description: "`product:<uuid>`" },
                quantity: { type: "integer", minimum: 1, maximum: 10, default: 1 },
                status: { type: "string", enum: ["active", "draft"], default: "active" },
            },
        },
    },
};

async function executeAddToCart(args = {}, ctx) {
    const productId = args.productId;
    const quantity = bound(args.quantity, 1, 10, 1);
    const status = args.status === "draft" ? "draft" : "active";

    const row = db.prepare("SELECT id, name FROM products WHERE id = ?").get(productId);
    if (!row) return { error: "not_found", productId };

    await ui.emit(ctx.userId, {
        action: "click",
        target: `product-card-add:${productId}`,
        why: `Adding ${row.name}${status === "draft" ? " (draft)" : ""} to your cart`,
    });
    // Let the cursor animation play before the cart actually mutates so the
    // visual "click → cart updates" causality reads correctly.
    await sleep(700);

    const result = await cartOps.addItem(
        ctx.userId,
        { productId, quantity, status },
        "agent"
    );
    if (!result.ok) return { error: result.error };
    return { ok: true, productId, productName: row.name, status, quantity };
}

const removeFromCartSchema = {
    type: "function",
    function: {
        name: "remove_from_cart",
        description: "Remove a product from the user's cart.",
        parameters: {
            type: "object",
            required: ["productId"],
            properties: {
                productId: { type: "string" },
            },
        },
    },
};

async function executeRemoveFromCart(args = {}, ctx) {
    await ui.emit(ctx.userId, {
        action: "click",
        target: `cart-remove:${args.productId}`,
        why: "Removing the previous pick",
    });
    await sleep(500);
    const result = await cartOps.removeItem(ctx.userId, args.productId, "agent");
    if (!result.ok) return { error: "not_found" };
    return { ok: true, productId: args.productId };
}

const setCartStatusSchema = {
    type: "function",
    function: {
        name: "set_cart_status",
        description: "Promote a draft pick to active (shopper accepted it) or demote an active item to draft.",
        parameters: {
            type: "object",
            required: ["productId", "status"],
            properties: {
                productId: { type: "string" },
                status: { type: "string", enum: ["active", "draft"] },
            },
        },
    },
};

async function executeSetCartStatus(args = {}, ctx) {
    const result = await cartOps.setStatus(ctx.userId, args.productId, args.status, "agent");
    if (!result.ok) return { error: "not_found" };
    return { ok: true, productId: args.productId, status: args.status };
}

// ============================================================
//                       REGISTRY
// ============================================================

const registry = {
    search_products: { schema: searchProductsSchema, execute: executeSearchProducts },
    semantic_search: { schema: semanticSearchSchema, execute: executeSemanticSearch },
    get_product: { schema: getProductSchema, execute: executeGetProduct },
    check_stock: { schema: checkStockSchema, execute: executeCheckStock },
    navigate: { schema: navigateSchema, execute: executeNavigate },
    apply_filter: { schema: applyFilterSchema, execute: executeApplyFilter },
    open_product: { schema: openProductSchema, execute: executeOpenProduct },
    highlight: { schema: highlightSchema, execute: executeHighlight },
    add_to_cart: { schema: addToCartSchema, execute: executeAddToCart },
    remove_from_cart: { schema: removeFromCartSchema, execute: executeRemoveFromCart },
    set_cart_status: { schema: setCartStatusSchema, execute: executeSetCartStatus },
};

const allSchemas = Object.values(registry).map((t) => t.schema);

async function runTool(name, rawArgs, ctx = {}) {
    const tool = registry[name];
    if (!tool) {
        return { error: "unknown_tool", tool: name };
    }
    let args;
    try {
        args = typeof rawArgs === "string" ? JSON.parse(rawArgs || "{}") : rawArgs || {};
    } catch (err) {
        return { error: "invalid_arguments", message: err.message };
    }
    try {
        return await tool.execute(args, ctx);
    } catch (err) {
        console.error(`[tool:${name}]`, err);
        return { error: "tool_error", message: err.message };
    }
}

module.exports = { registry, allSchemas, runTool };
