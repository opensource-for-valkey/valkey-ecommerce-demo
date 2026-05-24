import { authService } from "../services/auth.service.js";
import { HttpError } from "../utils/httpError.js";

const extractToken = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (token) {
      const session = await authService.verifyToken(token);
      req.user = session.user;
      req.token = token;
    }
    next();
  } catch (_error) {
    next();
  }
};

export const requireAuth = async (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (!token) throw new HttpError(401, "Authentication required");
    const session = await authService.verifyToken(token);
    req.user = session.user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new HttpError(401, "Authentication required"));
  if (!roles.includes(req.user.role)) {
    return next(new HttpError(403, "You do not have permission for this action"));
  }
  return next();
};

export const attachIdentity = (req, _res, next) => {
  req.identity =
    req.user?.id ||
    req.headers["x-session-id"] ||
    req.cookies?.vc_session ||
    "anonymous";
  next();
};

