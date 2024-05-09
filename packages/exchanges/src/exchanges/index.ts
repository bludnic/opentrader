import { ExchangeCode } from "@opentrader/types";
import type { IExchangeCredentials } from "../types/exchange-credentials.interface";
import { OkxExchange } from "./okx/exchange";

export const exchanges = {
  [ExchangeCode.OKX]: (credentials?: IExchangeCredentials) =>
    new OkxExchange(credentials),
} as const;
