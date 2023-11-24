import type { IExchange } from "@opentrader/exchanges";
import type { BaseEffect } from "./base-effect";
import type { USE_EXCHANGE } from "./effect-types";

export type UseExchangeEffect = BaseEffect<typeof USE_EXCHANGE, IExchange>;
