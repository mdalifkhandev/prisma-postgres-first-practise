import { Router, type Router as ExpressRouter } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/admins", adminController.getAllAdmins);

export const adminRouter: ExpressRouter = router;
