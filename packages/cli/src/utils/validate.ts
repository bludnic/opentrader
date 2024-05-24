import { BarSize, ExchangeCode } from "@opentrader/types";

export function validateTimeframe(timeframe?: string | null): BarSize | null {
  if (!timeframe) {
    return null;
  }

  const validTimeframes = Object.values(BarSize);

  if (validTimeframes.includes(timeframe as BarSize)) {
    return timeframe as BarSize;
  }

  throw new Error(
    `Invalid timeframe: ${timeframe}. Valid values are: ${validTimeframes.join(", ")}`,
  );
}

export function validatePair(pair?: string | null): string {
  if (!pair) {
    throw new Error("Trading pair is required");
  }

  const [baseCurrency, quoteCurrency] = pair.split("/");

  if (baseCurrency && quoteCurrency) {
    return pair.toUpperCase();
  }

  throw new Error(`Invalid trading pair: ${pair}. Expected format: BTC/USDT`);
}

export function validateExchange(exchangeCodeParam?: string | null): string {
  if (!exchangeCodeParam) {
    throw new Error("Exchange is required");
  }

  const validExchanges = Object.values(ExchangeCode);

  const exchangeCode = exchangeCodeParam.toUpperCase() as ExchangeCode;
  if (validExchanges.includes(exchangeCode)) {
    return exchangeCode;
  }

  throw new Error(
    `Invalid exchange: ${exchangeCode}. Valid values are: ${validExchanges.join(", ")}`,
  );
}
