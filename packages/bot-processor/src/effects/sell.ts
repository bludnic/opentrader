import type { ExchangeCode } from "@opentrader/types";
import { SELL } from "./types";
import { makeEffect } from "./utils";

export type SellPayload = {
  exchange: ExchangeCode;
  pair: string; // doesn't have effect, instead will be used the pair from buy effect
  quantity: number; // doesn't have effect, instead will be used the quantity from buy effect
  price?: number; // if not provided, it will be a market order
  orderType?: "Limit" | "Market";
};

export function sell(payload: SellPayload, ref = "0") {
  return makeEffect(SELL, payload, ref);
}
