import { dirname, join } from "node:path";
import { spawn } from "node:child_process";
import { logger } from "@opentrader/logger";
import type { CommandResult } from "../../types.js";
import { appPath } from "../../utils/app-path.js";
import { getPid, savePid } from "../../utils/pid.js";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDevelopment = process.env.NODE_ENV !== "production";

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

  const daemonProcess = isDevelopment
    ? spawn("ts-node", [join(__dirname, "daemon.ts")], {
        detached: options.detach,
        stdio: options.detach ? "ignore" : undefined,
      })
    : spawn("node", [join(__dirname, "daemon.mjs")], {
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
