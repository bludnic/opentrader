import { USE_ARB_TRADE } from "./types/index.js";
import { makeEffect } from "./utils/index.js";

type UseArbPayload = {
  /**
   * The quantity of the asset to trade.
   */
  quantity: number;
  /**
   * The exchange to buy from.
   */
  exchange1: number;
  /**
   * The exchange to sell to.
   */
  exchange2: number;
  /**
   * The Limit entry price of the order. If not provided, a market order will be placed.
   */
  price?: number;
  /**
   * The Limit exit price of the order. If not provided, a market order will be placed.
   */
  tp?: number;
  /**
   * The symbol to trade, e.g. BTC/USDT.
   */
  symbol?: string;
};

export function useArbTrade(params: UseArbPayload, ref = "0") {
  return makeEffect(USE_ARB_TRADE, params, ref);
}
