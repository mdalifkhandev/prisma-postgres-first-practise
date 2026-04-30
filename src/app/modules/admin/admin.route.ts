import { Router, type Router as ExpressRouter } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/admins", adminController.getAllAdmins);

//get single data
router.get("/admins/:id", adminController.getSingleAdmin);

//update data
router.patch("/admins/:id", adminController.updateAdmin);

//delete data
router.delete("/admins/:id", adminController.adminDeleted);

//soft deleted
router.delete("/admins/soft/:id", adminController.adminSoftDleted);

export const adminRouter: ExpressRouter = router;
