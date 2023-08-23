import { OrderStatusEnum } from "@bifrost/types";
import { BaseEffect } from "./base-effect";
import { USE_SMART_TRADE } from "./effect-types";

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

type SmartBuyPayload = {
  buy: {
    status?: OrderStatusEnum; // default to Idle
    price: number;
  };
  sell: null;
  quantity: number;
};

type SmartSellPayload = {
  buy: null;
  sell: {
    status?: OrderStatusEnum; // default to Idle
    price: number;
  };
  quantity: number;
};

export type UseSmartTradePayload =
  | SmartTradePayload
  | SmartBuyPayload
  | SmartSellPayload;

export type UseSmartTradeEffect = BaseEffect<
  typeof USE_SMART_TRADE,
  UseSmartTradePayload,
  string
>;
