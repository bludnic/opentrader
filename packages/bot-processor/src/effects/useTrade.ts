import type { ExchangeCode, OrderSide, OrderType } from "@opentrader/types";
import { makeEffect } from "./utils";
import { USE_TRADE } from "./types";

type UseTradePayload = {
  quantity: number;

  /**
   * Order side. Default to "buy"
   */
  side?: OrderSide;
  /**
   * Entry order price.
   */
  price?: number;
  /**
   * Take profit order price.
   */
  tp?: number;
  /**
   * Stop loss order price.
   */
  sl?: never; // not implemented yet

  exchange?: ExchangeCode;
  pair?: string;

  /**
   * Entry order type. Default to "Limit"
   */
  entryType?: OrderType;
  /**
   * Entry order type. Default to "Limit"
   */
  takeProfitType?: OrderType;
  /**
   * Entry order type. Default to "Market". Not implemented.
   */
  stopLossType?: OrderType;
};

export function useTrade(params: UseTradePayload, ref = "0") {
  return makeEffect(USE_TRADE, params, ref);
}
