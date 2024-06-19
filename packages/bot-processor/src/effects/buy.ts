import type { ExchangeCode } from "@opentrader/types";
import { BUY } from "./types/index.js";
import { makeEffect } from "./utils/index.js";

export type BuyPayload = {
  exchange?: ExchangeCode; // not implemented
  pair?: string; // not implemented
  quantity: number;
  price?: number; // if not provided, a market order will be placed
  orderType?: "Limit" | "Market";
};

export function buy(payload: BuyPayload, ref = "0") {
  return makeEffect(BUY, payload, ref);
}
