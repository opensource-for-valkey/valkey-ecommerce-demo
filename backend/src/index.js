// Express entrypoint. Boots the SQLite-backed REST API on PORT (default 4000).

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { db, DB_PATH } = require("./db");
const { attachSession } = require("./lib/auth");
const valkey = require("./lib/valkey");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const vendorsRouter = require("./routes/vendors");
const searchRouter = require("./routes/search");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");
const streamRouter = require("./routes/stream");
const agentRouter = require("./routes/agent");

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(
    cors({
        origin: FRONTEND_ORIGIN,
        credentials: true,
    })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(attachSession);

app.get("/api/health", (_req, res) => {
    const productCount = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
    res.json({
        status: "ok",
        db: DB_PATH,
        products: productCount,
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/vendors", vendorsRouter);
app.use("/api/search", searchRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/stream", streamRouter);
app.use("/api/agent", agentRouter);

// 404
app.use((req, res) => {
    res.status(404).json({
        error: "not_found",
        message: `No route for ${req.method} ${req.path}`,
    });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        error: "internal_error",
        message: err.message || "Something went wrong",
    });
});

const PORT = parseInt(process.env.PORT, 10) || 4000;
app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
    console.log(`SQLite DB: ${DB_PATH}`);
    valkey.connect().then(async () => {
        const ok = await valkey.isReady();
        if (ok) {
            console.log(`Valkey:    ready at ${valkey.VALKEY_URL}`);
        } else {
            console.log(`Valkey:    not reachable, using in-process bus`);
        }
    });
});
