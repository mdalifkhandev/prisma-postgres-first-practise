import type { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllAdmins(req.query);

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

export const adminController = {
  getAllAdmins,
};
