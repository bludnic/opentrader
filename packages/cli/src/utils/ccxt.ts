import { ExchangeCode } from "@opentrader/types";
import { pro as ccxt } from "ccxt";

export const exchangeClassMap: Record<ExchangeCode, keyof typeof ccxt> = {
  OKX: "okex",
};
