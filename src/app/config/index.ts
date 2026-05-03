import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  databaseUrl: requireEnv("DATABASE_URL"),
  jwtAccessSecret: requireEnv("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: requireEnv("JWT_REFRESH_SECRET"),
  jwtAccessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
    "1d") as SignOptions["expiresIn"],
  jwtRefreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
    "30d") as SignOptions["expiresIn"],
  refreshCookiePath:
    process.env.JWT_REFRESH_COOKIE_PATH || "/api/v1/auth/refresh-token",
  accessCookieName: process.env.JWT_ACCESS_COOKIE_NAME || "accessToken",
  refreshCookieName: process.env.JWT_REFRESH_COOKIE_NAME || "refreshToken",
};
