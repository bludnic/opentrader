import { ExchangeCode } from "@opentrader/types";
import { CURRENCY_PAIR_DELIMITER, EXCHANGE_CODE_DELIMITER } from "./constants.js";

export function isValidSymbolId(symbolId: string) {
  const exchangeCodes = Object.keys(ExchangeCode);
  const symbolPattern = `^(${exchangeCodes.join(
    "|",
  )})${EXCHANGE_CODE_DELIMITER}[A-Z0-9]+${CURRENCY_PAIR_DELIMITER}[A-Z]+$`;

  return new RegExp(symbolPattern).test(symbolId);
}
