import { ExchangeCode } from "@opentrader/types";

import { OkxExchange } from "./okx/exchange";
import { IExchangeCredentials } from "src/types/exchange-credentials.interface";

export const exchanges = {
  [ExchangeCode.OKX]: (credentials?: IExchangeCredentials) =>
    new OkxExchange(credentials),
};
