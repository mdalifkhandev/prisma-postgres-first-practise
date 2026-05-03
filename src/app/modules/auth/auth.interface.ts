export type TLoginData = {
  email: string;
  password: string;
};

export type TRefreshTokenData = {
  refreshToken?: string;
};

export type TLogoutData = {
  refreshToken?: string;
};
