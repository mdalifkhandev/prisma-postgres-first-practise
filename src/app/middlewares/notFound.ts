import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not found",
    path: req.originalUrl,
  });
  next();
};

export default notFound;
