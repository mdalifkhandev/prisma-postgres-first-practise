import pino from "pino";
import { env } from "../config/env";

const loggerOptions: pino.LoggerOptions = {
  level: env.NODE_ENV === "production" ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "password",
      "refreshToken",
      "accessToken",
    ],
    censor: "[REDACTED]",
  },
};

if (env.NODE_ENV === "development") {
  loggerOptions.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  };
}

export const logger = pino(loggerOptions);
