import type { OrderStatusEnum } from "@opentrader/types";
import type { SmartTrade } from "../types";
import {
  GET_SMART_TRADE,
  CANCEL_SMART_TRADE,
  CREATE_SMART_TRADE,
  REPLACE_SMART_TRADE,
  USE_SMART_TRADE,
} from "./types";
import { makeEffect } from "./utils";

// Default smart trade reference
const DEFAULT_REF = "0";

export type CreateSmartTradePayload = {
  buy: {
    price: number;
  };
  sell: {
    price: number;
  };
  quantity: number;
};
export type UseSmartTradePayload = {
  buy: {
    status?: OrderStatusEnum; // default to Idle
    price: number;
  };
  sell?: {
    status?: OrderStatusEnum; // default to Idle
    price: number;
  };
  quantity: number;
};

export function useSmartTrade(params: UseSmartTradePayload, ref = DEFAULT_REF) {
  return makeEffect(USE_SMART_TRADE, params, ref);
}

export function getSmartTrade(ref = DEFAULT_REF) {
  return makeEffect(GET_SMART_TRADE, undefined, ref);
}

export function createSmartTrade(
  payload: CreateSmartTradePayload,
  ref = DEFAULT_REF,
) {
  return makeEffect(CREATE_SMART_TRADE, payload, ref);
}

export function cancelSmartTrade(ref = DEFAULT_REF) {
  return makeEffect(CANCEL_SMART_TRADE, undefined, ref);
}

export function replaceSmartTrade(payload: SmartTrade, ref = DEFAULT_REF) {
  return makeEffect(REPLACE_SMART_TRADE, payload, ref);
}
