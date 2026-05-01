import type { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";

const getAllAdmins = async (req: Request, res: Response) => {
  const params = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  try {
    const result = await adminService.getAllAdmins(params, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Retreive all admins successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "An error occurred while retrieving admins",
      data: err,
    });
  }
};

const getSingleAdmin = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  if (!id) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Admin id is required",
      data: null,
    });
    return;
  }

  try {
    const result = await adminService.getSingleAdmin(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: err?.message || "An error occurred while retrieving the admin",
      data: err,
    });
  }
};

const updateAdmin = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
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

  try {
    const result = await adminService.updateAdmin(id, data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: err?.message || "An error occurred while updating the admin",
      data: err,
    });
  }
};

const adminDeleted = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;

  if (!id) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Admin id is required",
      data: null,
    });
    return;
  }
  try {
    const result = await adminService.deletedAdmin(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: err?.message || "An error occurred while deleting the admin",
      data: err,
    });
  }
};

const adminSoftDleted = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  try {
    const result = await adminService.adminSoftDeleted(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin soft deleted successfully",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message:
        err?.message || "An error occurred while soft deleting the admin",
      data: err,
    });
  }
};

export const adminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  adminDeleted,
  adminSoftDleted,
};
