import { type OHLCV, pro as ccxt } from "ccxt";
import { ExchangeCode } from "@opentrader/types";
import { exchangeCodeMapCCXT } from "@opentrader/exchanges";

export function ccxtInstanceFromExchangeCode(exchangeCode: ExchangeCode) {
  const ccxtClassName = exchangeCodeMapCCXT[exchangeCode];
  const exchange = new ccxt[ccxtClassName]();

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
