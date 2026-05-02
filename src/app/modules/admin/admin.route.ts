import { Router, type Router as ExpressRouter } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.getAllAdmins);
//get single data
router.get("/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.getSingleAdmin);

//update data
router.patch("/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.updateAdmin);

//delete data
router.delete("/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.adminDeleted);

//soft deleted
router.delete("/soft/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.adminSoftDleted);

export const adminRouter: ExpressRouter = router;
