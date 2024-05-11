import { ExchangeCode } from "@opentrader/types";
import { createExchange } from "./ccxt/factory";
import { exchangeCodeMapCCXT } from "./ccxt/constants";

export const exchanges: Record<
  ExchangeCode,
  ReturnType<typeof createExchange>
> = {
  [ExchangeCode.OKX]: createExchange(ExchangeCode.OKX),
  [ExchangeCode.BYBIT]: createExchange(ExchangeCode.BYBIT),
  [ExchangeCode.BINANCE]: createExchange(ExchangeCode.BINANCE),
  [ExchangeCode.KRAKEN]: createExchange(ExchangeCode.KRAKEN),
  [ExchangeCode.COINBASE]: createExchange(ExchangeCode.COINBASE),
  [ExchangeCode.GATEIO]: createExchange(ExchangeCode.GATEIO),
} as const;

export { exchangeCodeMapCCXT };
