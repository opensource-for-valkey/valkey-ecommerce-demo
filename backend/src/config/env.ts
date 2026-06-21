import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  VALKEY_URL: z.string().default("redis://localhost:6379"),
  JWT_SECRET: z.string().default("dev-shopmind-secret-change-me"),
  SESSION_TTL_SECONDS: z.coerce.number().default(60 * 60 * 24 * 7),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  DEMO_SEED_COUNT: z.coerce.number().default(1000)
});

export const env = schema.parse(process.env);
