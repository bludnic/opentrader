import { join } from "path";
import { spawn } from "child_process";
import { Processor } from "@opentrader/bot";
import { xprisma } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { CommandResult } from "../../types";
import { appPath } from "../../utils/app-path";
import { getPid, savePid } from "../../utils/pid";

type Options = {
  detach: boolean;
};

export async function up(options: Options): Promise<CommandResult> {
  const pid = getPid();

  if (pid) {
    logger.warn(`Daemon process is already running with PID: ${pid}`);

    return {
      result: undefined,
    };
  }

  const daemonProcess = spawn("ts-node", [join(__dirname, "daemon.ts")], {
    detached: options.detach,
    stdio: options.detach ? "ignore" : undefined,
  });

  if (daemonProcess.pid === undefined) {
    throw new Error("Failed to start daemon process");
  }

  logger.info(`OpenTrader daemon started with PID: ${daemonProcess.pid}`);

  if (options.detach) {
    daemonProcess.unref();
    savePid(daemonProcess.pid);
    logger.info(`Daemon process detached and saved to ${appPath}`);
  } else {
    daemonProcess.stdout?.pipe(process.stdout);
    daemonProcess.stderr?.pipe(process.stderr);
  }

  console.log("Main process PID:", process.pid);
  console.log("Daemon process PID:", daemonProcess.pid);

  return {
    result: undefined,
  };
}
