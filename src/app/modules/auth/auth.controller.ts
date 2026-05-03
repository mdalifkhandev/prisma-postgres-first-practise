import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../middlewares/catchAsync";
import { authService } from "./auth.service";
import httpStatus from "http-status";
import type { Request, Response } from "express";
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

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successfully",
    data: { accessToken, ...rest },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[env.refreshCookieName];
  const result = await authService.refreshToken({ refreshToken });

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
    data: result,
  });
});

export const authController = {
  userLogin,
  refreshToken,
};
