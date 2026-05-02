import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import { mainRouter } from "./app/router";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/v1", mainRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
