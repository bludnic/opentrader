import { USE_SMART_TRADE } from "./common/types/effect-types";
import { SmartTradeEffect, UseSmartTradePayload } from "./common/types/use-smart-trade-effect";
import { makeEffect } from "./utils/make-effect";


export function useSmartTrade(key: string, params: UseSmartTradePayload): SmartTradeEffect {
    return makeEffect(USE_SMART_TRADE, params, key)
}