import { homedir } from "node:os";
import { join } from "node:path";

const APP_DIR = ".opentrader";

export const appPath = join(homedir(), APP_DIR);
export const logPath = join(appPath, "log.log");
