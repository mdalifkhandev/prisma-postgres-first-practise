import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import { mainRouter } from "./app/router";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import pinoHttp from "pino-http";
import { randomUUID } from "crypto";
import { logger } from "./shared/logger";
import { env } from "./config/env";
import { redisClient } from "./shared/redis";

const app: Application = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  pinoHttp({
    logger,
    genReqId: (req) =>
      (req.headers["x-request-id"] as string | undefined) ?? randomUUID(),
  }),
);

const limiterOptions: {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: true;
  legacyHeaders: false;
  store?: RedisStore;
} = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
};

if (redisClient) {
  const redis = redisClient;
  limiterOptions["store"] = new RedisStore({
    sendCommand: (...args: string[]) =>
      redis.call(args[0]!, ...args.slice(1)) as Promise<any>,
  });
}

const limiter = rateLimit(limiterOptions);

if (!redisClient) {
  logger.warn(
    "REDIS_URL is not set. Falling back to in-memory rate limiting store.",
  );
}

app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/v1", mainRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
