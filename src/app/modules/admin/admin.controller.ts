import type { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import httpStatus from "http-status";

const sendResponse = <T>(
  res: Response,
  resData: {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data: T | null | undefined;
  },
) => {
  res.status(resData.statusCode).json({
    success: resData.success,
    message: resData.message,
    meta: resData.meta,
    data: resData.data,
  });
};

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
    res.status(500).json({
      success: false,
      message: err?.message || "An error occurred while retrieving admins",
      error: err,
    });
  }
};

const getSingleAdmin = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Admin id is required",
    });
  }

  try {
    const result = await adminService.getSingleAdmin(id);
    return res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || "An error occurred while retrieving the admin",
      error: err,
    });
  }
};

const updateAdmin = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Admin id is required",
    });
  }

  try {
    const result = await adminService.updateAdmin(id, data);
    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || "An error occurred while updating the admin",
      error: err,
    });
  }
};

const adminDeleted = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Admin id is required",
    });
  }
  try {
    const result = await adminService.deletedAdmin(id);
    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || "An error occurred while deleting the admin",
      error: err,
    });
  }
};

const adminSoftDleted = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  try {
    const result = await adminService.adminSoftDeleted(id);
    res.status(200).json({
      success: true,
      message: "Admin soft deleted successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message:
        err?.message || "An error occurred while soft deleting the admin",
      error: err,
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
