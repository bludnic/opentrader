import { IExchange } from "@opentrader/exchanges";
import { BaseEffect } from "./base-effect";
import { USE_EXCHANGE } from "./effect-types";

export type UseExchangeEffect = BaseEffect<typeof USE_EXCHANGE, IExchange>;
