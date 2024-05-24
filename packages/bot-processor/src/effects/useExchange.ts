import { USE_EXCHANGE } from "./types";
import { makeEffect } from "./utils";

/**
 * If no label is provided, the default exchange linked to the bot will be used.
 * If provided, an external exchange with the given label will be used.
 */
export function useExchange(label?: string) {
  return makeEffect(USE_EXCHANGE, label, undefined);
}
