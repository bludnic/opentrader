import { ExchangeCode } from "@bifrost/types";
import { IExchange } from "src/types";

import { OkxExchange } from "./okx/exchange";
import { IExchangeCredentials } from "src/types/exchange-credentials.interface";

export type Exchanges = Record<
  ExchangeCode,
  (credentials?: IExchangeCredentials) => IExchange
>;

export const exchanges: Exchanges = {
  [ExchangeCode.OKX]: (credentials?: IExchangeCredentials) =>
    new OkxExchange(credentials),
};
