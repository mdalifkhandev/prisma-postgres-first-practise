import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

export type TJwtPayload = {
  userId: string;
  email: string;
  role: string;
};

const getAccessSecret = (): Secret => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }
  return secret;
};

const getRefreshSecret = (): Secret => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  return secret;
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
