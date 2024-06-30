import type { ExchangeCode } from "@opentrader/types";
import { CURRENCY_PAIR_DELIMITER, EXCHANGE_CODE_DELIMITER } from "./constants.js";

export function composeSymbolId(
  exchangeCode: ExchangeCode,
  baseCurrency: string,
  quoteCurrency: string,
) {
  return `${exchangeCode.toUpperCase()}${EXCHANGE_CODE_DELIMITER}${baseCurrency}${CURRENCY_PAIR_DELIMITER}${quoteCurrency}`;
}
