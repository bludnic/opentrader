import { ExchangeCode } from "@bifrost/types";
import { CURRENCY_PAIR_DELIMITER, EXCHANGE_CODE_DELIMITER } from "./constants";

export function composeSymbolId(
  exchangeCode: ExchangeCode,
  baseCurrency: string,
  quoteCurrency: string
) {
  return (
    `${exchangeCode.toUpperCase()}` +
    EXCHANGE_CODE_DELIMITER +
    `${baseCurrency}` +
    CURRENCY_PAIR_DELIMITER +
    `${quoteCurrency}`
  );
}
