import { ExchangeCode } from "@opentrader/types";
import { CURRENCY_PAIR_DELIMITER, EXCHANGE_CODE_DELIMITER } from "./constants.js";

const exchangeCodes = Object.keys(ExchangeCode);
const spotSymbolPattern = `^(${exchangeCodes.join(
  "|",
)})${EXCHANGE_CODE_DELIMITER}[A-Z0-9]+${CURRENCY_PAIR_DELIMITER}[A-Z0-9]+$`;
const futuresSymbolPattern = `^(${exchangeCodes.join(
  "|",
)})${EXCHANGE_CODE_DELIMITER}[A-Z0-9]+${CURRENCY_PAIR_DELIMITER}[A-Z0-9]+${EXCHANGE_CODE_DELIMITER}[A-Z0-9]+$`;

export function isValidSymbolId(symbolId: string) {
  return new RegExp(spotSymbolPattern).test(symbolId) || new RegExp(futuresSymbolPattern).test(symbolId);
}
