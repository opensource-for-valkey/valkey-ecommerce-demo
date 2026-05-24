import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { Request } from "express";
import type { Redis } from "ioredis";
import type { CheckoutConfig } from "./config";
import { ApiError } from "./errors";
import { createId } from "./ids";
import type { PublicUser, User } from "./types";

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: PublicUser;
  token: string;
  expiresIn: number;
}

export interface AuthenticatedSession {
  userId: string;
  token: string;
  user: PublicUser;
}

const LOGIN_WINDOW_SECONDS = 900;
const MAX_LOGIN_ATTEMPTS = 5;

export function userKey(userId: string): string {
  return userId;
}

export function emailUserKey(email: string): string {
  return `email_user:${normalizeEmail(email)}`;
}

export function sessionKey(token: string): string {
  return `session:${token}`;
}

export function userSessionsKey(userId: string): string {
  return `user_sessions:${userId}`;
}

export function loginAttemptsKey(email: string): string {
  return `login_attempts:${normalizeEmail(email)}`;
}

export async function registerUser(client: Redis, config: CheckoutConfig, input: RegisterInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  validateEmail(email);
  validatePassword(input.password);

  const existingUserId = await client.get(emailUserKey(email));
  if (existingUserId) {
    throw new ApiError(409, "email_already_registered", "An account already exists for this email.");
  }

  const now = new Date().toISOString();
  const user: User = {
    id: createId("user"),
    email,
    passwordHash: await bcrypt.hash(input.password, config.bcryptRounds),
    firstName: requiredString(input.firstName, "firstName"),
    lastName: requiredString(input.lastName, "lastName"),
    phone: input.phone,
    role: "customer",
    addresses: [],
    preferences: {
      currency: "INR",
      language: "en",
      notifications: true,
    },
    createdAt: now,
    lastLoginAt: now,
  };

  await client.call("JSON.SET", userKey(user.id), "$", JSON.stringify(user));
  await client.set(emailUserKey(email), user.id);
  const token = await createSession(client, config, user.id);
  return { user: publicUser(user), token, expiresIn: config.sessionTtlSeconds };
}

export async function loginUser(client: Redis, config: CheckoutConfig, input: LoginInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  const attemptsKey = loginAttemptsKey(email);
  const attempts = Number(await client.get(attemptsKey)) || 0;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    throw new ApiError(429, "too_many_login_attempts", "Too many failed login attempts. Try again later.");
  }

  const userId = await client.get(emailUserKey(email));
  const user = userId ? await getUser(client, userId) : null;
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    const nextAttempts = await client.incr(attemptsKey);
    if (nextAttempts === 1) {
      await client.expire(attemptsKey, LOGIN_WINDOW_SECONDS);
    }
    throw new ApiError(
      nextAttempts >= MAX_LOGIN_ATTEMPTS ? 429 : 401,
      nextAttempts >= MAX_LOGIN_ATTEMPTS ? "too_many_login_attempts" : "invalid_credentials",
      nextAttempts >= MAX_LOGIN_ATTEMPTS ? "Too many failed login attempts. Try again later." : "Email or password is incorrect."
    );
  }

  await client.del(attemptsKey);
  const now = new Date().toISOString();
  await client.call("JSON.SET", userKey(user.id), "$.lastLoginAt", JSON.stringify(now));
  const token = await createSession(client, config, user.id);
  return { user: publicUser({ ...user, lastLoginAt: now }), token, expiresIn: config.sessionTtlSeconds };
}

export async function authenticateRequest(
  client: Redis,
  config: CheckoutConfig,
  request: Request,
  options: { allowUserIdHeader?: boolean } = {}
): Promise<AuthenticatedSession> {
  const token = sessionTokenFromRequest(request);
  if (token) {
    const userId = await client.get(sessionKey(token));
    if (!userId) {
      throw new ApiError(401, "invalid_session", "Session is expired or invalid.");
    }

    await client.expire(sessionKey(token), config.sessionTtlSeconds);
    const user = await getUser(client, userId);
    if (!user) {
      throw new ApiError(401, "invalid_session", "Session user no longer exists.");
    }

    return { userId, token, user: publicUser(user) };
  }

  if (options.allowUserIdHeader) {
    const userId = request.header("X-User-Id");
    if (userId) {
      return {
        userId,
        token: "",
        user: {
          id: userId,
          email: `${userId.replace(/[^a-z0-9-]/gi, "-")}@demo.local`,
          firstName: "Demo",
          lastName: "User",
          role: "customer",
          addresses: [],
          preferences: { currency: "INR", language: "en", notifications: true },
          createdAt: new Date().toISOString(),
          lastLoginAt: null,
        },
      };
    }
  }

  throw new ApiError(401, "unauthorized", "A valid session token is required.");
}

export async function refreshSession(client: Redis, config: CheckoutConfig, token: string): Promise<number> {
  const userId = await client.get(sessionKey(token));
  if (!userId) {
    throw new ApiError(401, "invalid_session", "Session is expired or invalid.");
  }

  await client.expire(sessionKey(token), config.sessionTtlSeconds);
  return config.sessionTtlSeconds;
}

export async function logoutSession(client: Redis, token: string): Promise<void> {
  const userId = await client.get(sessionKey(token));
  await client.del(sessionKey(token));
  if (userId) {
    await client.zrem(userSessionsKey(userId), token);
  }
}

export async function getUser(client: Redis, userId: string): Promise<User | null> {
  const raw = await client.call("JSON.GET", userKey(userId), "$");
  if (!raw || typeof raw !== "string") {
    return null;
  }
  return (JSON.parse(raw) as User[])[0] ?? null;
}

export function publicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export function sessionTokenFromRequest(request: Request): string | null {
  const authorization = request.header("Authorization");
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  return request.header("X-Session-Token") ?? null;
}

async function createSession(client: Redis, config: CheckoutConfig, userId: string): Promise<string> {
  const token = crypto.randomUUID();
  await client.set(sessionKey(token), userId, "EX", config.sessionTtlSeconds);
  await client.zadd(userSessionsKey(userId), Date.now(), token);
  await client.expire(userSessionsKey(userId), config.sessionTtlSeconds * 7);
  return token;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateEmail(email: string): void {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new ApiError(400, "invalid_email", "A valid email address is required.");
  }
}

function validatePassword(password: string): void {
  if (typeof password !== "string" || password.length < 8) {
    throw new ApiError(400, "invalid_password", "Password must be at least 8 characters.");
  }
}

function requiredString(value: string, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, "invalid_request", `${field} is required.`);
  }
  return value.trim();
}
