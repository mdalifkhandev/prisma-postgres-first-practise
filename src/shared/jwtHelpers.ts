import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type TJwtPayload = {
  userId: string;
  email: string;
  role: string;
};

const getAccessSecret = (): Secret => {
  return env.JWT_ACCESS_SECRET;
};

const getRefreshSecret = (): Secret => {
  return env.JWT_REFRESH_SECRET;
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
  return jwt.verify(token, getAccessSecret()) as TJwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, getRefreshSecret()) as TJwtPayload;
};
