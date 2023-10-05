import { ExchangeCode } from "@opentrader/types";
import { IExchangeCredentials } from "src/types/exchange-credentials.interface";

import { OkxExchange } from "./okx/exchange";

export const exchanges = {
  [ExchangeCode.OKX]: (credentials?: IExchangeCredentials) =>
    new OkxExchange(credentials),
};
