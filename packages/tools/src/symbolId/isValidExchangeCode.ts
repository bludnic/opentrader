import { ExchangeCode } from "@bifrost/types";

export function isValidExchangeCode(exchangeCode: ExchangeCode) {
  return Object.keys(ExchangeCode).includes(exchangeCode);
}
