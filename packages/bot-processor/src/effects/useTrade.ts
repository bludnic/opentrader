import type { ExchangeCode, OrderSide } from "@opentrader/types";
import { makeEffect } from "./utils";
import { USE_TRADE } from "./types";

export type UseTradePayload = {
  exchange: ExchangeCode;
  pair: string;
  side: OrderSide;
  quantity: number;
  tp?: number;
  sl?: number;
  price?: number; // if not provided, it will be a market order
  entryOrderType?: "Limit" | "Market";
  takeProfitOrderType?: "Limit" | "Market";
  stopLossOrderType?: "Limit" | "Market";
};

export function useTrade(params: UseTradePayload, ref = "") {
  return makeEffect(USE_TRADE, params, ref);
}
