import { Router, type Router as ExpressRouter } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/users", userController.createAdmin);

router.post("/users", userController.createAdmin);

export const userRouter: ExpressRouter = router;
