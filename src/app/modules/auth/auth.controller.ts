import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../middlewares/catchAsync";
import { authService } from "./auth.service";
import httpStatus from "http-status";
import type { Request, Response } from "express";
import { env } from "../../../config/env";

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.userLogin({ email, password });
  const { refreshToken, ...rest } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/v1/auth/refresh-token",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successfully",
    data: rest,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const result = await authService.refreshToken({ refreshToken });

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
