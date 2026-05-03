import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
<<<<<<< HEAD
import { env } from "../config/env";
=======
import { env } from "../app/config";
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c

export type TJwtPayload = {
  userId: string;
  email: string;
  role: string;
  jti?: string;
};

type TVerifiedJwtPayload = TJwtPayload & { exp?: number; iat?: number };

const getAccessSecret = (): Secret => {
<<<<<<< HEAD
  return env.JWT_ACCESS_SECRET;
};

const getRefreshSecret = (): Secret => {
  return env.JWT_REFRESH_SECRET;
=======
  return env.jwtAccessSecret;
};

const getRefreshSecret = (): Secret => {
  return env.jwtRefreshSecret;
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c
};

export const createAccessToken = (
  payload: TJwtPayload,
  expiresIn: SignOptions["expiresIn"] = "1d",
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, getAccessSecret(), options);
};

export const createRefreshToken = (
  payload: TJwtPayload,
  expiresIn: SignOptions["expiresIn"] = "30d",
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, getRefreshSecret(), options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, getAccessSecret()) as TVerifiedJwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, getRefreshSecret()) as TVerifiedJwtPayload;
};
