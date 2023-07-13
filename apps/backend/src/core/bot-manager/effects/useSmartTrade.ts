import { USE_SMART_TRADE } from "./common/types/effect-types";
import { UseSmartTradeEffect, UseSmartTradePayload } from "./common/types/use-smart-trade-effect";
import { makeEffect } from "./utils/make-effect";


export function useSmartTrade(key: string, params: UseSmartTradePayload): UseSmartTradeEffect {
    return makeEffect(USE_SMART_TRADE, params, key)
}