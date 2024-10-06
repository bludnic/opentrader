import { USE_DCA } from "./types/index.js";
import { makeEffect } from "./utils/index.js";

type SafetyOrder = {
  quantity: number;
  relativePrice: number;
};

type UseDcaPayload = {
  /**
   * Entry order quantity
   */
  quantity: number;
  /**
   * The Limit entry price of the order. If not provided, a market order will be placed.
   */
  price?: number;
  /**
   * The Limit exit price of the order (e.g. 0.01 is 10%)
   */
  tpPercent: number;
  /**
   * Safety orders to be placed when price goes down
   */
  safetyOrders: SafetyOrder[];
  /**
   * The symbol to trade, e.g. BTC/USDT.
   */
  symbol?: string;
};

export function useDca(params: UseDcaPayload, ref = "0") {
  return makeEffect(USE_DCA, params, ref);
}
