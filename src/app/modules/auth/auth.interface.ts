import type { UserRole } from "@prisma/client";

export type TLoginData = {
  email: string;
  password: string;
};

export type TRefreshTokenData = {
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
