<<<<<<< HEAD
import type { TLoginData, TLogoutData, TRefreshTokenData } from "./auth.interface";
=======
import type {
  TChangePasswordPaylode,
  TChangePasswordUserData,
  TLoginData,
  TRefreshTokenData,
} from "./auth.interface";
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c
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
<<<<<<< HEAD
import { createHash, randomUUID } from "crypto";

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const toExpiryDate = (exp?: number) => {
  if (!exp) {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  return new Date(exp * 1000);
};
=======
import { env } from "../../config";
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c

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
<<<<<<< HEAD
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken({ ...payload, jti: randomUUID() });
  const decodedRefreshToken = verifyRefreshToken(refreshToken);

  await prisma.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: toExpiryDate(decodedRefreshToken.exp),
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
      lastUsedAt: new Date(),
    },
  });
=======
  const accessToken = createAccessToken(payload, env.jwtAccessExpiresIn);
  const refreshToken = createRefreshToken(payload, env.jwtRefreshExpiresIn);
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c

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
  const oldTokenHash = hashToken(data.refreshToken);

  const session = await prisma.refreshSession.findUnique({
    where: { tokenHash: oldTokenHash },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    await prisma.refreshSession.updateMany({
      where: { userId: decoded.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token session");
  }

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

<<<<<<< HEAD
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
  const newRefreshTokenHash = hashToken(newRefreshToken);
  const decodedNewRefreshToken = verifyRefreshToken(newRefreshToken);

  await prisma.$transaction([
    prisma.refreshSession.update({
      where: { tokenHash: oldTokenHash },
      data: {
        revokedAt: new Date(),
        replacedByTokenHash: newRefreshTokenHash,
        lastUsedAt: new Date(),
      },
    }),
    prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt: toExpiryDate(decodedNewRefreshToken.exp),
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        lastUsedAt: new Date(),
      },
    }),
  ]);
=======
  const newAccessToken = createAccessToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtAccessExpiresIn,
  );
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

<<<<<<< HEAD
const cleanupExpiredRefreshSessions = async () => {
  await prisma.refreshSession.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
=======
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
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c
    },
  });
};

<<<<<<< HEAD
const logout = async (data: TLogoutData) => {
  if (!data.refreshToken) {
    return;
  }

  const tokenHash = hashToken(data.refreshToken);

  await prisma.refreshSession.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

=======
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c
export const authService = {
  userLogin,
  passwordChange,
  refreshToken,
  logout,
  cleanupExpiredRefreshSessions,
};
