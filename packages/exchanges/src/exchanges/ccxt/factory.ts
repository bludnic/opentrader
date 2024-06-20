import { ExchangeCode } from "@opentrader/types";
import { CCXTExchange } from "./exchange.js";
import type { IExchangeCredentials } from "../../types/index.js";

export function createExchange(exchangeCode: ExchangeCode) {
  return (credentials?: IExchangeCredentials) =>
    new CCXTExchange(exchangeCode, credentials);
}
