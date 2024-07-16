import { join } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import { appPath } from "./app-path.js";

const PASS_FILE = "pass";

export const savePassword = (password: string) => {
  mkdirSync(appPath, { recursive: true });
  writeFileSync(join(appPath, PASS_FILE), password);
};
