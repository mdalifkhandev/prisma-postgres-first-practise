import type { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllAdmins = async (req: Request, res: Response) => {
  const params = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log(options);

  try {
    const result = await adminService.getAllAdmins(params, options);

    res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      data: result,
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

export const adminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deletedAdmin: adminDeleted,
};
