import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { config } from "../config/env.js";
import { valkey } from "./valkey.service.js";
import { HttpError } from "../utils/httpError.js";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  addresses: user.addresses || [],
  createdAt: user.createdAt
});

class AuthService {
  constructor() {
    this.users = new Map();
    this.ready = false;
  }

  async init() {
    if (this.ready) return;

    const admin = {
      id: "user-admin",
      name: "VAL-HYD Admin",
      email: config.demoAdmin.email.toLowerCase(),
      role: "admin",
      passwordHash: await bcrypt.hash(config.demoAdmin.password, 12),
      addresses: [
        {
          id: "addr-admin",
          label: "Operations HQ",
          line1: "1 Commerce Plaza",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "US"
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.users.set(admin.email, admin);
    this.ready = true;
  }

  async register({ name, email, password }) {
    await this.init();
    const normalizedEmail = email.toLowerCase();
    if (this.users.has(normalizedEmail)) {
      throw new HttpError(409, "An account already exists for this email");
    }

    const user = {
      id: `user-${nanoid(10)}`,
      name,
      email: normalizedEmail,
      role: "customer",
      passwordHash: await bcrypt.hash(password, 12),
      addresses: [],
      createdAt: new Date().toISOString()
    };

    this.users.set(normalizedEmail, user);
    return this.issueSession(user);
  }

  async login({ email, password }) {
    await this.init();
    const user = this.users.get(email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpError(401, "Invalid email or password");
    }
    return this.issueSession(user);
  }

  async issueSession(user) {
    const jti = nanoid(18);
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, jti },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    await valkey.setJson(
      `session:${jti}`,
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        createdAt: new Date().toISOString()
      },
      SESSION_TTL_SECONDS
    );

    return {
      token,
      user: publicUser(user)
    };
  }

  async verifyToken(token) {
    await this.init();
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const session = await valkey.getJson(`session:${payload.jti}`);
      if (!session) throw new HttpError(401, "Session expired");
      const user = [...this.users.values()].find((entry) => entry.id === payload.sub);
      if (!user) throw new HttpError(401, "User no longer exists");
      return { payload, user: publicUser(user) };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(401, "Invalid or expired token");
    }
  }

  async logout(token) {
    const payload = jwt.verify(token, config.jwtSecret);
    await valkey.del(`session:${payload.jti}`);
  }

  async getProfile(userId) {
    await this.init();
    const user = [...this.users.values()].find((entry) => entry.id === userId);
    if (!user) throw new HttpError(404, "User not found");
    return publicUser(user);
  }

  async updateProfile(userId, payload) {
    await this.init();
    const user = [...this.users.values()].find((entry) => entry.id === userId);
    if (!user) throw new HttpError(404, "User not found");

    if (payload.name) user.name = payload.name;
    if (payload.addresses) user.addresses = payload.addresses;
    return publicUser(user);
  }
}

export const authService = new AuthService();
