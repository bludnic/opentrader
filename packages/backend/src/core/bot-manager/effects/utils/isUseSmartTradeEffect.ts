import { USE_SMART_TRADE } from "../common/types/effect-types";
import { UseSmartTradeEffect } from "../common/types/use-smart-trade-effect";

export function isUseSmartTradeEffect(effect: unknown): effect is UseSmartTradeEffect {
    return (effect && (effect as any).type) === USE_SMART_TRADE
}