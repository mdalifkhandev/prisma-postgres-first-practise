import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import { env } from "../../../config/env";
import AppError from "../../../shared/AppError";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../../shared/jwtHelpers";
import { prisma } from "../../../shared/prisma";
import type {
  TChangePasswordPaylode,
  TChangePasswordUserData,
  TLoginData,
  TLogoutData,
  TRefreshTokenData,
} from "./auth.interface";

const userLogin = async (data: TLoginData) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  if (user.status === UserStatus.DELETED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  const isPasswordMatched = await bcrypt.compare(data.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken({ ...payload, jti: randomUUID() });
  return {
    accessToken,
    refreshToken,
    id: user.id,
    email: user.email,
    role: user.role,
    needPasswordChange: user.needPasswordChange,
    status: user.status,
  };
};

const refreshToken = async (data: TRefreshTokenData) => {
  if (!data.refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }

  const decoded = verifyRefreshToken(data.refreshToken);

  const user = await prisma.user.findUnique({
    where: { email: decoded.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  if (user.status === UserStatus.DELETED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = createAccessToken(payload);
  const newRefreshToken = createRefreshToken({
    ...payload,
    jti: randomUUID(),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async (data: TLogoutData) => {
  void data;
};

const cleanupExpiredRefreshSessions = async () => {
  return;
};

const passwordChange = async (
  user: TChangePasswordUserData,
  paylode: TChangePasswordPaylode,
) => {
  const userData = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!userData || userData.status !== UserStatus.ACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Not Found");
  }

  const isPasswordMatch = await bcrypt.compare(
    paylode.oldPassword,
    userData.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old Password Incorrect");
  }

  const hashPassword = await bcrypt.hash(paylode.newPassword, env.BCRYPT_SALT_ROUNDS);

  return prisma.user.update({
    where: { email: user.email },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
};

export const authService = {
  userLogin,
  passwordChange,
  refreshToken,
  logout,
  cleanupExpiredRefreshSessions,
};
