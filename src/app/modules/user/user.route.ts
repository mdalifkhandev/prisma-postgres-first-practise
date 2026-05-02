import { Router, type Router as ExpressRouter } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "../admin/admin.validation";

const router = Router();

router.get("/", userController.createAdmin);

router.post("/",validateRequest(adminValidation.createAdmin), userController.createAdmin);

export const userRouter: ExpressRouter = router;
