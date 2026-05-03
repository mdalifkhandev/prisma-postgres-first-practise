import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../middlewares/catchAsync";
import { authService } from "./auth.service";
import httpStatus from "http-status";
import type { Request, Response } from "express";
<<<<<<< HEAD
import { env } from "../../../config/env";

const isProduction = env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("strict" as const) : ("lax" as const),
  path: "/api/v1/auth",
  maxAge: env.REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
};

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.userLogin({
    email,
    password,
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });
  const { refreshToken, ...rest } = result;

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
=======
import { env } from "../../config";

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.userLogin({ email, password });
  const { refreshToken, accessToken, ...rest } = result;

  res.cookie(env.accessCookieName, accessToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
  });

  res.cookie(env.refreshCookieName, refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: env.refreshCookiePath,
  });
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successfully",
    data: { accessToken, ...rest },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
<<<<<<< HEAD
  const refreshToken = req.cookies?.refreshToken;
  const result = await authService.refreshToken({
    refreshToken,
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });
  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
=======
  const refreshToken = req.cookies?.[env.refreshCookieName];
  const result = await authService.refreshToken({ refreshToken });
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c

  res.cookie(env.accessCookieName, result.accessToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: {
      accessToken: result.accessToken,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  await authService.logout({ refreshToken });

  res.clearCookie("refreshToken", refreshCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

export const authController = {
  userLogin,
  refreshToken,
  logout,
};
