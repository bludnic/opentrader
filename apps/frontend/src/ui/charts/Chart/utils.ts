import { type OHLCV, pro as ccxt } from "ccxt";
import { ExchangeCode } from "@opentrader/types";

export function ccxtInstanceFromExchangeCode(exchangeCode: ExchangeCode) {
  const map: Record<ExchangeCode, keyof typeof ccxt> = {
    [ExchangeCode.OKX]: "okx",
  };

  const exchange = new ccxt[map[exchangeCode]]();

  return exchange;
}

export function logCandle(message: string, candle: OHLCV) {
  const [timestamp, open, high, low, close, volume] = candle;

  console.log(
    message,
    "open",
    open,
    "high",
    high,
    "low",
    low,
    "close",
    close,
    "volume",
    volume,
    "timestamp",
    timestamp,
    new Date(timestamp).toISOString(),
  );
}
