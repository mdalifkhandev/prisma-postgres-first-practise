import type { Request, Response } from "express";
import { userService } from "./user.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: err?.message || "An error occurred while creating admin",
      data: err,
    });
  }
};

export const userController = {
  createAdmin,
};
