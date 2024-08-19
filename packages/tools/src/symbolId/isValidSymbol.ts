import { CURRENCY_PAIR_DELIMITER } from "./constants.js";

export function isValidSymbol(symbol: string) {
  const symbolPattern = `^[A-Z0-9]+${CURRENCY_PAIR_DELIMITER}[A-Z0-9]+$`;

  return new RegExp(symbolPattern).test(symbol);
}
