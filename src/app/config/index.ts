import dotenv from "dotenv";
import path from "path";
import type { SignOptions } from "jsonwebtoken";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL as string,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  refreshCookiePath: process.env.JWT_REFRESH_COOKIE_PATH as string,
  accessCookieName: process.env.JWT_ACCESS_COOKIE_NAME as string,
  refreshCookieName: process.env.JWT_REFRESH_COOKIE_NAME as string,
};
