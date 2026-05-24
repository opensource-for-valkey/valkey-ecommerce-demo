import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { authService } from "../services/auth.service.js";
import {
  authLoginSchema,
  authRegisterSchema,
  profileSchema
} from "../validators/schemas.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validate(authRegisterSchema),
  asyncHandler(async (req, res) => {
    const session = await authService.register(req.validated.body);
    res.status(201).json(session);
  })
);

authRouter.post(
  "/login",
  validate(authLoginSchema),
  asyncHandler(async (req, res) => {
    res.json(await authService.login(req.validated.body));
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: await authService.getProfile(req.user.id) });
  })
);

authRouter.patch(
  "/me",
  requireAuth,
  validate(profileSchema),
  asyncHandler(async (req, res) => {
    res.json({ user: await authService.updateProfile(req.user.id, req.validated.body) });
  })
);

authRouter.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    await authService.logout(req.token);
    res.status(204).send();
  })
);

