import { join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { appPath } from "./app-path";

/**
 * Save daemon process PID to file
 */
export const savePid = (pid: number) => {
  mkdirSync(appPath, { recursive: true });
  writeFileSync(join(appPath, "pid"), pid.toString());
};

/**
 * Return current daemon process PID
 */
export const getPid = () => {
  try {
    const pid = parseInt(readFileSync(join(appPath, "pid"), "utf8"));
    return isNaN(pid) ? null : pid;
  } catch (err) {
    return null;
  }
};

export const clearPid = () => {
  mkdirSync(appPath, { recursive: true });
  writeFileSync(join(appPath, "pid"), "");
};
