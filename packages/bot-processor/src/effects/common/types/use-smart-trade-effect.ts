import type { OrderStatusEnum } from "@opentrader/types";
import type { BaseEffect } from "./base-effect";
import type { USE_SMART_TRADE } from "./effect-types";

type SmartTradePayload = {
  buy: {
    status?: OrderStatusEnum; // default to Idle
    price: number;
  };
  sell: {
    status?: OrderStatusEnum; // default to Idle
    price: number;
  };
  quantity: number;
};

export type UseSmartTradePayload = SmartTradePayload;

export type UseSmartTradeEffect = BaseEffect<
  typeof USE_SMART_TRADE,
  UseSmartTradePayload,
  string
>;
