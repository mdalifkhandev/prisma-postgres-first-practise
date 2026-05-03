import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().url("REDIS_URL must be a valid URL").optional(),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(1),
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://localhost:5173"),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(30 * 24 * 60 * 60 * 1000),
  REFRESH_SESSION_CLEANUP_INTERVAL_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(60 * 60 * 1000),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(15).default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
  throw new Error(`Invalid environment configuration: ${message}`);
}

export const env = parsed.data;
