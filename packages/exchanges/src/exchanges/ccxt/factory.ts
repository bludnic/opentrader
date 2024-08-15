import { ExchangeCode } from "@opentrader/types";
import { CCXTExchange } from "./exchange.js";
import { PaperExchange } from "./paper-exchange.js";
import type { IExchangeCredentials } from "../../types/index.js";

export function createExchange(exchangeCode: ExchangeCode) {
  return (credentials?: IExchangeCredentials) => {
    if (credentials?.isPaperAccount) return new PaperExchange(exchangeCode);

    return new CCXTExchange(exchangeCode, credentials);
  };
}
