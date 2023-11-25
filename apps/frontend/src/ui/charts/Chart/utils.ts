import { pro as ccxt } from "ccxt";
import { BarSize, ExchangeCode } from "@opentrader/types";

export function barSizeToMinutes(barSize: BarSize): number {
  const map: Record<BarSize, number> = {
    "1m": 1,
    "5m": 5,
    "15m": 15,
    "1h": 60,
    "4h": 60 * 4,
    "1d": 60 * 24,
    "1w": 60 * 24 * 7,
    "1M": 60 * 24 * 30,
    "3M": 60 * 24 * 30 * 3,
  };

  return map[barSize];
}

export function ccxtInstanceFromExchangeCode(exchangeCode: ExchangeCode) {
  const map: Record<ExchangeCode, keyof typeof ccxt> = {
    [ExchangeCode.OKX]: "okx",
  };

  const exchange = new ccxt[map[exchangeCode]]();

  return exchange;
}
