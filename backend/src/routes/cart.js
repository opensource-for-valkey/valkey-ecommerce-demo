// Cart endpoints. Always scoped to req.user. Mutations delegate to
// services/cartOps so the agent's tools can perform the same operations
// through one shared code path (and emit the same cart.updated broadcast).

const express = require("express");
const { z } = require("zod");

const { requireAuth } = require("../lib/auth");
const { loadCart } = require("../services/cart");
const cartOps = require("../services/cartOps");

const router = express.Router();
router.use(requireAuth);

const addSchema = z.object({
    productId: z.string().min(1).max(120),
    quantity: z.number().int().positive().max(99).default(1),
    status: z.enum(["active", "draft"]).default("active"),
});

const patchSchema = z.object({
    quantity: z.number().int().positive().max(99).optional(),
    status: z.enum(["active", "draft"]).optional(),
});

// GET /api/cart
router.get("/", (req, res) => {
    res.json(loadCart(req.user.id));
});

// POST /api/cart/items
router.post("/items", async (req, res) => {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "invalid_request",
            message: "productId required",
            details: parsed.error.flatten(),
        });
    }
    const result = await cartOps.addItem(req.user.id, parsed.data, "user");
    if (!result.ok) {
        return res.status(404).json({
            error: result.error,
            message: `Product ${parsed.data.productId} not found`,
        });
    }
    res.status(201).json(result.cart);
});

// PATCH /api/cart/items/:productId
router.patch("/items/:productId", async (req, res) => {
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success || (parsed.data.quantity == null && parsed.data.status == null)) {
        return res.status(400).json({
            error: "invalid_request",
            message: "Provide quantity and/or status",
        });
    }
    const result = await cartOps.patchItem(
        req.user.id,
        req.params.productId,
        parsed.data,
        "user"
    );
    if (!result.ok) {
        return res.status(404).json({ error: "not_found", message: "Item not in cart" });
    }
    res.json(result.cart);
});

// DELETE /api/cart/items/:productId
router.delete("/items/:productId", async (req, res) => {
    const result = await cartOps.removeItem(req.user.id, req.params.productId, "user");
    if (!result.ok) {
        return res.status(404).json({ error: "not_found", message: "Item not in cart" });
    }
    res.json(result.cart);
});

// DELETE /api/cart   — clear everything
router.delete("/", async (req, res) => {
    const result = await cartOps.clearCart(req.user.id, "user");
    res.json(result.cart);
});

module.exports = router;
