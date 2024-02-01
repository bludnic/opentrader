import type {
  CreateSmartTradeEffect,
  CreateSmartTradePayload,
} from "./common/types/create-smart-trade-effect";
import { CREATE_SMART_TRADE } from "./common/types/effect-types";
import { makeEffect } from "./utils/make-effect";

export function createSmartTrade(
  ref: string,
  params: CreateSmartTradePayload,
): CreateSmartTradeEffect {
  return makeEffect(CREATE_SMART_TRADE, params, ref);
}
