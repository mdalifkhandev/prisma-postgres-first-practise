import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { mainRouter } from "./app/router";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
<<<<<<< HEAD
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import pinoHttp from "pino-http";
import { randomUUID } from "crypto";
import { logger } from "./shared/logger";
import { env } from "./config/env";
import { redisClient } from "./shared/redis";
import { prisma } from "./shared/prisma";
=======
import { swaggerSpec } from "./app/config/swagger";
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c

const app: Application = express();
const allowedOrigins = env.CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", env.TRUST_PROXY_HOPS);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

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
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "OK",
    data: { uptime: process.uptime() },
  });
});

app.get("/ready", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    if (redisClient) {
      await redisClient.ping();
    }

    res.status(200).json({
      success: true,
      message: "READY",
      data: {
        database: "ok",
        redis: redisClient ? "ok" : "not-configured",
      },
    });
  } catch {
    res.status(503).json({
      success: false,
      message: "NOT_READY",
      data: {
        database: "down",
        redis: redisClient ? "down" : "not-configured",
      },
    });
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs-json", (req: Request, res: Response) => {
  res.json(swaggerSpec);
});

app.use("/api/v1", mainRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
