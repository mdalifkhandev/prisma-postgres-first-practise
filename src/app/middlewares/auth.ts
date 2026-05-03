import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../shared/AppError";
import { verifyAccessToken } from "../../shared/jwtHelpers";
import { env } from "../config";

const auth = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.[env.accessCookieName] as
      | string
      | undefined;

    if (!authHeader && !cookieToken) {
      return next(
        new AppError(
          httpStatus.UNAUTHORIZED,
          "Authorization token is required",
        ),
      );
    }

    const headerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    const token = headerToken || cookieToken;

    if (!token) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "Invalid authorization format"),
      );
    }

    try {
      const decoded = verifyAccessToken(token);
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return next(new AppError(httpStatus.FORBIDDEN, "Forbidden access"));
      }

      (req as any).user = decoded;
      next();
    } catch {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token"),
      );
    }
  };
};

export default auth;
