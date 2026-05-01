import { Router, type Router as ExpressRouter } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/", userController.createAdmin);

router.post("/", userController.createAdmin);

export const userRouter: ExpressRouter = router;
