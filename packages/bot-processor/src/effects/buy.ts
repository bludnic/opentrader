import type { ExchangeCode } from "@opentrader/types";
import { BUY } from "./types";
import { makeEffect } from "./utils";

export type BuyPayload = {
  exchange: ExchangeCode;
  pair: string;
  quantity: number;
  price?: number; // if not provided, a market order will be placed
  orderType?: "Limit" | "Market";
};

export function buy(payload: BuyPayload, ref = "0") {
  return makeEffect(BUY, payload, ref);
}
