import { Router, type Router as ExpressRouter } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/", adminController.getAllAdmins);
//get single data
router.get("/:id", adminController.getSingleAdmin);

//update data
router.patch("/:id", adminController.updateAdmin);

//delete data
router.delete("/:id", adminController.adminDeleted);

//soft deleted
router.delete("/soft/:id", adminController.adminSoftDleted);

export const adminRouter: ExpressRouter = router;
