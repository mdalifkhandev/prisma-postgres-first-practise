import type { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import AppError from "../../shared/AppError";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
      input: issue.input,
    }));
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Validation failed",
      errorDetails: formattedErrors,
    });
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2023") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Invalid id format";
    } else if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = "Duplicate field value";
    } else {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Database request error";
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails: err,
  });
};

export default globalErrorHandler;
