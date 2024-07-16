import { execa } from "execa";
import { logger } from "@opentrader/logger";
import { CommandResult } from "../types.js";

export async function db(operation: string): Promise<CommandResult> {
  if (operation === "migrate") {
    execa("npx prisma migrate dev", {
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
