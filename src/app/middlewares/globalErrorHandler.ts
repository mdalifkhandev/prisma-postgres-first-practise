import type { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import AppError from "../../shared/AppError";
import { Prisma } from "@prisma/client";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong ";

  if (err instanceof AppError) {
    ((statusCode = err.statusCode), (message = err.message));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    ((statusCode = httpStatus.BAD_REQUEST),
      (message = "Invalid admin id fromate"));
  } else if (err instanceof Error) {
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: err,
  });
};

export default globalErrorHandler;
