import { Router, type Router as ExpressRouter } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "./admin.validation";

const router = Router();

router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.getAllAdmins);
//get single data
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidation.adminIdParamSchema),
  adminController.getSingleAdmin,
);

//update data
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidation.updateAdmin),
  adminController.updateAdmin,
);

//delete data
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidation.adminIdParamSchema),
  adminController.adminDeleted,
);

//soft deleted
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidation.adminIdParamSchema),
  adminController.adminSoftDleted,
);

export const adminRouter: ExpressRouter = router;
