// Session-cookie auth middleware. Reads the `sid` cookie, validates the row in
// `sessions`, populates `req.user` and `req.session` for downstream handlers.
//
// Sessions are stored in SQLite today; the lookup is intentionally a single
// indexed query so we can swap the implementation for `GET session:<token>`
// in Valkey later (see HACKATHON.md Challenge 1).

const { db } = require("../db");

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const COOKIE_NAME = "sid";

function nowIso() {
    return new Date().toISOString();
}

function expiresIso(ttlMs = SESSION_TTL_MS) {
    return new Date(Date.now() + ttlMs).toISOString();
}

const findSession = db.prepare(
    `SELECT s.id AS session_id, s.user_id, s.expires_at,
          u.email, u.first_name, u.last_name, u.role
     FROM sessions s
     JOIN users u ON u.id = s.user_id
    WHERE s.id = ?`
);
const touchSession = db.prepare(
    `UPDATE sessions SET last_seen_at = ?, expires_at = ? WHERE id = ?`
);

function attachSession(req, _res, next) {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return next();

    const row = findSession.get(token);
    if (!row) return next();

    if (new Date(row.expires_at).getTime() < Date.now()) {
        // Expired — sweep it now and continue unauthenticated
        db.prepare("DELETE FROM sessions WHERE id = ?").run(token);
        return next();
    }

    // Sliding TTL: refresh on every authenticated request.
    touchSession.run(nowIso(), expiresIso(), token);

    req.session = { id: row.session_id, token };
    req.user = {
        id: row.user_id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
    };
    next();
}

function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            error: "unauthorized",
            message: "Sign in required",
        });
    }
    next();
}

const COOKIE_OPTS = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // `secure: true` would break local http://localhost development; toggle in
    // production via env if we deploy this.
    secure: false,
    maxAge: SESSION_TTL_MS,
};

module.exports = {
    COOKIE_NAME,
    COOKIE_OPTS,
    SESSION_TTL_MS,
    attachSession,
    requireAuth,
    nowIso,
    expiresIso,
};
