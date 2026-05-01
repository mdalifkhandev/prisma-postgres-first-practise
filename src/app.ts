import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./app/modules/user/user.route";
import { adminRouter } from "./app/modules/admin/admin.route";
import morgan from "morgan";
import { mainRouter } from "./app/router";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/v1", mainRouter);

export default app;
