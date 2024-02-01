import type { BaseEffect } from "./base-effect";
import type { CREATE_SMART_TRADE } from "./effect-types";

export type CreateSmartTradePayload = {
  buy: {
    price: number;
  };
  sell: {
    price: number;
  };
  quantity: number;
};

export type CreateSmartTradeEffect = BaseEffect<
  typeof CREATE_SMART_TRADE,
  CreateSmartTradePayload,
  string
>;
