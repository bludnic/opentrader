import type { ExchangeCode } from "@opentrader/types";
import { SELL } from "./types";
import { makeEffect } from "./utils";

export type SellPayload = {
  exchange?: ExchangeCode; // // not implemented
  pair?: string; // // not implemented
  quantity: number; // doesn't have an effect, instead will be used the quantity from buy effect
  price?: number; // if not provided, it will be a market order
  orderType?: "Limit" | "Market";
};

export function sell(payload: SellPayload, ref = "0") {
  return makeEffect(SELL, payload, ref);
}
