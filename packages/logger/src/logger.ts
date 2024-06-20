import { pino } from "pino";

const logFile = process.env.LOG_FILE;

export const logger = logFile
  ? pino({
      transport: {
        targets: [
          {
            target: "pino-pretty",
            options: {
              ignore: "pid,hostname",
              sync: true,
            },
          },
          {
            target: "pino/file",
            options: {
              destination: logFile,
            },
          },
        ],
      },
    })
  : pino({
      transport: {
        target: "pino-pretty",
        options: {
          ignore: "pid,hostname",
          sync: true,
        },
      },
    });
