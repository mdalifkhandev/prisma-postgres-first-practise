import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { adminRouter } from "../modules/admin/admin.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/admins",
    route: adminRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const mainRouter: Router = router;
