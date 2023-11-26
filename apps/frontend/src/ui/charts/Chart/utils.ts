import { pro as ccxt } from "ccxt";
import { ExchangeCode } from "@opentrader/types";

export function ccxtInstanceFromExchangeCode(exchangeCode: ExchangeCode) {
  const map: Record<ExchangeCode, keyof typeof ccxt> = {
    [ExchangeCode.OKX]: "okx",
  };

  const exchange = new ccxt[map[exchangeCode]]();

  return exchange;
}
