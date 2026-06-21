import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { env } from "../../config/env";
import { requireAuth, signToken, type AuthRequest } from "../../middleware/auth";
import type { User } from "../../types/domain";
import { getValkey } from "../../valkey/client";
import { JsonRepository } from "../../valkey/jsonRepository";
import { keys } from "../../valkey/keys";
import { valkeyRateLimit } from "../../valkey/rateLimiter";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/errors";
import { id } from "../../utils/ids";

const router = Router();
const users = new JsonRepository<User>();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

router.post(
  "/register",
  valkeyRateLimit("register", 10, 60),
  asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);
    const client = await getValkey();
    const existing = await client.get(keys.userEmail(body.email));
    if (existing) throw new AppError(409, "Email already registered");
    const now = new Date().toISOString();
    const user: User = {
      id: id("user"),
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash: await bcrypt.hash(body.password, 10),
      role: "customer",
      addresses: [],
      preferences: {},
      createdAt: now,
      updatedAt: now
    };
    await users.set(keys.user(user.id), user);
    await client.set(keys.userEmail(user.email), user.id);
    const sessionId = id("sess");
    await client.set(keys.session(sessionId), JSON.stringify({ userId: user.id, createdAt: now }), { EX: env.SESSION_TTL_SECONDS });
    const token = signToken(user, sessionId);
    const { passwordHash: _passwordHash, ...safeUser } = user;
    res.status(201).json({ user: safeUser, token });
  })
);

router.post(
  "/login",
  valkeyRateLimit("login", 8, 60),
  asyncHandler(async (req, res) => {
    const body = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
    const client = await getValkey();
    const userId = await client.get(keys.userEmail(body.email));
    if (!userId) throw new AppError(401, "Invalid credentials");
    const user = await users.get(keys.user(userId));
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      throw new AppError(401, "Invalid credentials");
    }
    const sessionId = id("sess");
    await client.set(keys.session(sessionId), JSON.stringify({ userId: user.id, createdAt: new Date().toISOString() }), {
      EX: env.SESSION_TTL_SECONDS
    });
    const token = signToken(user, sessionId);
    const { passwordHash: _passwordHash, ...safeUser } = user;
    res.json({ user: safeUser, token });
  })
);

router.post(
  "/logout",
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json({ ok: true });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    res.json({ user: req.user });
  })
);

router.post(
  "/password/forgot",
  valkeyRateLimit("password-reset", 5, 60),
  asyncHandler(async (req, res) => {
    const body = z.object({ email: z.string().email() }).parse(req.body);
    const client = await getValkey();
    const token = id("reset");
    const userId = await client.get(keys.userEmail(body.email));
    if (userId) await client.set(keys.reset(token), userId, { EX: 60 * 15 });
    res.json({ ok: true, demoResetToken: userId ? token : undefined });
  })
);

router.post(
  "/password/reset",
  asyncHandler(async (req, res) => {
    const body = z.object({ token: z.string(), password: z.string().min(8) }).parse(req.body);
    const client = await getValkey();
    const userId = await client.get(keys.reset(body.token));
    if (!userId) throw new AppError(400, "Invalid reset token");
    const user = await users.get(keys.user(userId));
    if (!user) throw new AppError(404, "User not found");
    user.passwordHash = await bcrypt.hash(body.password, 10);
    user.updatedAt = new Date().toISOString();
    await users.set(keys.user(user.id), user);
    await client.del(keys.reset(body.token));
    res.json({ ok: true });
  })
);

export default router;
