import { USE_EXCHANGE } from "../common/types/effect-types";
import { ExchangeEffect } from "../common/types/use-exchange-effect";

export function isExchangeEffect(effect: unknown): effect is ExchangeEffect {
    return (effect && (effect as any).type) === USE_EXCHANGE
}