import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { mainRouter } from "./app/router";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app: Application = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 1 * 60 + 1000,
  max: 1,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/v1", limiter, mainRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
