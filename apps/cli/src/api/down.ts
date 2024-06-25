import { logger } from "@opentrader/logger";
import { CommandResult } from "../types.js";
import { getPid, clearPid } from "../utils/pid.js";

type Options = {
  force: boolean;
};

export async function down(options: Options): Promise<CommandResult> {
  const pid = getPid();

  if (!pid) {
    logger.warn("There is no running daemon process. Nothing to stop.");
    return {
      result: undefined,
    };
  }

  try {
    if (options.force) {
      process.kill(pid, "SIGKILL");
      logger.info(
        `Daemon process with PID ${pid} has been forcefully stopped.`,
      );
    } else {
      process.kill(pid, "SIGTERM");
      logger.info(
        `Daemon process with PID ${pid} has been gracefully stopped.`,
      );
    }
  } catch (err) {
    logger.info(`Failed to stop daemon process with PID ${pid}`);
    logger.error(err);
  }

  clearPid();

  return {
    result: undefined,
  };
}
