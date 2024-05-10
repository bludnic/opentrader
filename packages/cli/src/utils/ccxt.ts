import type { ExchangeCode } from "@opentrader/types";
import type { pro as ccxt } from "ccxt";

export const exchangeClassMap: Record<ExchangeCode, keyof typeof ccxt> = {
  OKX: "okex",
};
