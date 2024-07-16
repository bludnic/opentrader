import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execa } from "execa";
import { logger } from "@opentrader/logger";
import { CommandResult } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "../"); // relative to ./bin
const PRISMA_BIN = join(ROOT_DIR, "node_modules/prisma/build/index.js");

export async function db(operation: string): Promise<CommandResult> {
  if (operation === "migrate") {
    execa(`${PRISMA_BIN} migrate dev --skip-generate`, {
      stdio: "inherit",
      shell: true,
    });

    logger.info("Database migrated successfully.");
  } else {
    throw new Error(`Operation ${operation} is not supported.`);
  }

  return {
    result: undefined,
  };
}
