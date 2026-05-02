import { Router, type Router as ExpressRouter } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(adminValidation.createAdmin),
  userController.createAdmin,
);

export const userRouter: ExpressRouter = router;
