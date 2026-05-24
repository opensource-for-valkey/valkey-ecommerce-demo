// Basic email + password auth. bcrypt-hashed passwords, server-managed
// session cookie. Intentionally minimal — no email verification, no password
// reset, no rate limiting beyond what we'll add when the app sees real load.

const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const { db } = require("../db");
const { createId } = require("../lib/id");
const {
    COOKIE_NAME,
    COOKIE_OPTS,
    SESSION_TTL_MS,
    requireAuth,
    nowIso,
    expiresIso,
} = require("../lib/auth");

const router = express.Router();

const credentialsSchema = z.object({
    email: z.string().email().max(254),
    password: z.string().min(8).max(200),
});

const registerSchema = credentialsSchema.extend({
    firstName: z.string().min(1).max(80).optional(),
    lastName: z.string().min(1).max(80).optional(),
});

function publicUser(u) {
    return {
        id: u.id,
        email: u.email,
        firstName: u.firstName ?? u.first_name ?? null,
        lastName: u.lastName ?? u.last_name ?? null,
        role: u.role,
    };
}

const insertUser = db.prepare(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, role, created_at)
   VALUES (@id, @email, @password_hash, @first_name, @last_name, @role, @created_at)`
);
const findUserByEmail = db.prepare("SELECT * FROM users WHERE email = ?");
const insertSession = db.prepare(
    `INSERT INTO sessions (id, user_id, created_at, expires_at, last_seen_at)
   VALUES (?, ?, ?, ?, ?)`
);
const updateLogin = db.prepare("UPDATE users SET last_login_at = ? WHERE id = ?");
const deleteSession = db.prepare("DELETE FROM sessions WHERE id = ?");

function createSession(userId) {
    const sessionId = createId("session");
    const now = nowIso();
    insertSession.run(sessionId, userId, now, expiresIso(), now);
    return sessionId;
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "invalid_request",
            message: "Email + password required (password >= 8 chars)",
            details: parsed.error.flatten(),
        });
    }
    const { email, password, firstName, lastName } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    if (findUserByEmail.get(normalizedEmail)) {
        return res.status(409).json({
            error: "email_taken",
            message: "An account with this email already exists",
        });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = createId("user");

    insertUser.run({
        id,
        email: normalizedEmail,
        password_hash,
        first_name: firstName ?? null,
        last_name: lastName ?? null,
        role: "customer",
        created_at: nowIso(),
    });

    const sessionId = createSession(id);
    updateLogin.run(nowIso(), id);
    res.cookie(COOKIE_NAME, sessionId, COOKIE_OPTS);

    res.status(201).json({
        user: publicUser({ id, email: normalizedEmail, firstName, lastName, role: "customer" }),
    });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "invalid_request",
            message: "Email and password required",
        });
    }
    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = findUserByEmail.get(normalizedEmail);
    // Constant-ish-time path: always run bcrypt to avoid leaking which emails
    // exist via response-time differences.
    const ok = user
        ? await bcrypt.compare(password, user.password_hash)
        : await bcrypt.compare(password, "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi");

    if (!user || !ok) {
        return res.status(401).json({
            error: "invalid_credentials",
            message: "Invalid email or password",
        });
    }

    const sessionId = createSession(user.id);
    updateLogin.run(nowIso(), user.id);
    res.cookie(COOKIE_NAME, sessionId, COOKIE_OPTS);

    res.json({ user: publicUser(user) });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
    const token = req.cookies?.[COOKIE_NAME];
    if (token) deleteSession.run(token);
    res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTS, maxAge: undefined });
    res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
    res.json({ user: publicUser(req.user) });
});

module.exports = router;
module.exports.SESSION_TTL_MS = SESSION_TTL_MS;
