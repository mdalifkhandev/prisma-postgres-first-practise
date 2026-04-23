import type { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const reuslt = await userService.createAdmin(req.body);
    res.send(reuslt);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || "An error occurred while creating admin",
      error: err,
    });
  }
};

export const userController = {
  createAdmin,
};
