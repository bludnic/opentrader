import { USE_EXCHANGE } from "./common/types/effect-types";
import { UseExchangeEffect } from "./common/types/use-exchange-effect";
import { makeEffect } from "./utils/make-effect";

export function useExchange(): UseExchangeEffect {
    return makeEffect(USE_EXCHANGE)
}