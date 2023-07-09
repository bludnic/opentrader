import { USE_SMART_TRADE } from "../common/types/effect-types";
import { SmartTradeEffect } from "../common/types/use-smart-trade-effect";

export function isSmartTradeEffect(effect: unknown): effect is SmartTradeEffect {
    return (effect && (effect as any).type) === USE_SMART_TRADE
}