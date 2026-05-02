import type { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../middlewares/catchAsync";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const params = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await adminService.getAllAdmins(params, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retreive all admins successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Admin id is required",
      data: null,
    });
    return;
  }

  const result = await adminService.getSingleAdmin(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const data = req.body;

  if (!id) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Admin id is required",
      data: null,
    });
    return;
  }

  const result = await adminService.updateAdmin(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const adminDeleted = catchAsync(async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Admin id is required",
      data: null,
    });
    return;
  }
  const result = await adminService.deletedAdmin(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

const adminSoftDleted = catchAsync(async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Admin id is required",
      data: null,
    });
    return;
  }

  const result = await adminService.adminSoftDeleted(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin soft deleted successfully",
    data: result,
  });
});

export const adminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  adminDeleted,
  adminSoftDleted,
};
