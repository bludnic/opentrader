import { logger } from "@opentrader/logger";
import type { CommandResult } from "../types";

/**
 * Return a wrapper what will process an async function and log the result
 * @param asyncFunc - async function to process
 */
export function handle<T extends any[], U>(
  asyncFunc: (...args: T) => Promise<CommandResult<U>> | CommandResult<U>,
) {
  return async (...args: T): Promise<void> => {
    try {
      const { result } = await asyncFunc(...args);

      if (result) {
        logger.info(result);
      }
    } catch (error) {
      console.error(error);
    }
  };
}
