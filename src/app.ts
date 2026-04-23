import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./app/modules/user/user.route";
import { adminRouter } from "./app/modules/admin/admin.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/v1", userRouter);
app.use("/api/v1", adminRouter);

export default app;
