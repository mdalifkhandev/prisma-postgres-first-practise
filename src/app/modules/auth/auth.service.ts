import type {
  TChangePasswordPaylode,
  TChangePasswordUserData,
  TLoginData,
  TRefreshTokenData,
} from "./auth.interface";
import { UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../../shared/AppError";
import { prisma } from "../../../shared/prisma";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../../shared/jwtHelpers";
import { env } from "../../config";

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
  const accessToken = createAccessToken(payload, env.jwtAccessExpiresIn);
  const refreshToken = createRefreshToken(payload, env.jwtRefreshExpiresIn);

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

  const newAccessToken = createAccessToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtAccessExpiresIn,
  );

  return {
    accessToken: newAccessToken,
  };
};

const passwordChange = async (
  user: TChangePasswordUserData,
  paylode: TChangePasswordPaylode,
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Not Found");
  }

  const isPasswordMatch = await bcrypt.compare(
    paylode.oldPassword,
    userData.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old Password Incored");
  }
  const hashPassword = await bcrypt.hash(paylode.newPassword, 10);

  const result = prisma.user.update({
    where: {
      email: user.email,
    },
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
};
