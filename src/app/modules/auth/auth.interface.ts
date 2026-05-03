import type { UserRole } from "@prisma/client";

export type TLoginData = {
  email: string;
  password: string;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
};

export type TRefreshTokenData = {
  refreshToken?: string;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
};

export type TLogoutData = {
  refreshToken?: string;
};

export type TChangePasswordUserData = {
  email: string;
  role: UserRole;
};

export type TChangePasswordPaylode = {
  oldPassword: string;
  newPassword: string;
};
