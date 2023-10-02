import { ExchangeCode } from "@opentrader/types";

export function isValidExchangeCode(exchangeCode: ExchangeCode) {
  return Object.keys(ExchangeCode).includes(exchangeCode);
}
