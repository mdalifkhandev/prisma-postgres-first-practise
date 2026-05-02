import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/login",
  validateRequest(authValidation.userLoginSchema),
  authController.userLogin,
);
router.post(
  "/refresh-token",
  validateRequest(authValidation.refreshTokenSchema),
  authController.refreshToken,
);

export const authRouter: Router = router;
