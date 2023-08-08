import { USE_EXCHANGE } from "../common/types/effect-types";
import { UseExchangeEffect } from "../common/types/use-exchange-effect";

export function isUseExchangeEffect(effect: unknown): effect is UseExchangeEffect {
    return (effect && (effect as any).type) === USE_EXCHANGE
}