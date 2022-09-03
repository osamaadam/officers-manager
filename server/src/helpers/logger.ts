import winston from "winston";
import { resolve } from "path";

export const winLogger = () => {
  const loggerDir = resolve(__dirname, "..", "..", "logs");

  const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({
        filename: "error.log",
        level: "error",
        dirname: loggerDir,
      }),
      new winston.transports.File({
        filename: "combined.log",
        dirname: loggerDir,
      }),
    ],
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({
            format: "YYYYMMDDTHH:mm:ss",
          }),
          winston.format.align(),
          winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
          )
        ),
      })
    );
  }

  return logger;
};
