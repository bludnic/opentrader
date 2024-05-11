import { ExchangeCode } from "@opentrader/types";
import { CCXTExchange } from "./exchange";
import type { IExchangeCredentials } from "../../types";

export function createExchange(exchangeCode: ExchangeCode) {
  return (credentials?: IExchangeCredentials) =>
    new CCXTExchange(exchangeCode, credentials);
}
