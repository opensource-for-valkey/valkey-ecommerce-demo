import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JsonRepository } from "../valkey/jsonRepository";
import { keys } from "../valkey/keys";
import type { User } from "../types/domain";
import { AppError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: Omit<User, "passwordHash">;
}

const repo = new JsonRepository<User>();

export const signToken = (user: Pick<User, "id" | "email" | "role">, sessionId: string) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role, sid: sessionId }, env.JWT_SECRET, { expiresIn: "7d" });

export const requireAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : req.cookies?.shopmind_token;
  if (!token) return next(new AppError(401, "Authentication required"));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; sid: string };
    const user = await repo.get(keys.user(payload.sub));
    if (!user) return next(new AppError(401, "User not found"));
    const { passwordHash: _passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    await requireAuth(req, _res, next);
  } catch {
    next();
  }
};

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") return next(new AppError(403, "Admin access required"));
  next();
};
