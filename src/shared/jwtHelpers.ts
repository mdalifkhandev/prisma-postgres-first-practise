import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../app/config";

export type TJwtPayload = {
  userId: string;
  email: string;
  role: string;
};

const getAccessSecret = (): Secret => {
  return env.jwtAccessSecret;
};

const getRefreshSecret = (): Secret => {
  return env.jwtRefreshSecret;
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
