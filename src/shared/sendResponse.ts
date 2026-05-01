import type { Response } from "express";

type ISendResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T | null | undefined;
};


const sendResponse = <T>(res: Response, resData: ISendResponse<T>) => {
  res.status(resData.statusCode).json({
    success: resData.success,
    message: resData.message,
    meta: resData.meta,
    data: resData.data,
  });
};


export default sendResponse;
