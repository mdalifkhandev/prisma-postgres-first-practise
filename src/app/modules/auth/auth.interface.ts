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
