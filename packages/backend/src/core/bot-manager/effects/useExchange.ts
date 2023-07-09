import { USE_EXCHANGE } from "./common/types/effect-types";
import { ExchangeEffect } from "./common/types/use-exchange-effect";
import { makeEffect } from "./utils/make-effect";

export function useExchange(): ExchangeEffect {
    return makeEffect(USE_EXCHANGE)
}