import { logger } from "@opentrader/logger";
import {
  existsSync,
  readFileSync,
  createReadStream,
  watchFile,
  read,
} from "fs";
import { createInterface } from "readline";
import { CommandResult } from "../types";
import { logPath } from "../utils/app-path";

logger;

type Options = {
  follow: boolean;
};

export async function logs(options: Options): Promise<CommandResult> {
  // const pid = getPid();

  // if (!pid) {
  //   logger.info("Not running daemon process. Nothing to show logs for.");

  //   return {
  //     result: undefined,
  //   };
  // }

  const logFileExists = existsSync(logPath);

  if (!logFileExists) {
    logger.info("Log file does not exist. Nothing to show logs for.");

    return {
      result: undefined,
    };
  }

  if (options.follow) {
    const logsData = readFileSync(logPath, "utf8");
    const logsLines = logsData.split("\n");

    // Print the last 10 lines
    for (const line of logsLines.slice(-10)) {
      console.log(line);
    }

    // Keep track of the last file size
    let lastSize = 0;

    watchFile(logPath, (curr, prev) => {
      if (curr.size > prev.size) {
        const stream = createReadStream(logPath, {
          start: lastSize,
          end: curr.size,
        });
        const rl = createInterface({ input: stream });

        rl.on("line", (line) => {
          console.log(line);
        });

        rl.on("close", () => {
          lastSize = curr.size;
        });
      }
    });
  } else {
    const logsData = readFileSync(logPath, "utf8");
    const logsLines = logsData.split("\n");

    for (const line of logsLines) {
      console.log(line);
    }
  }

  return {
    result: undefined,
  };
}
