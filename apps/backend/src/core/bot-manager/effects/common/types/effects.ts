import { ReplaceSmartTradeEffect } from "./replace-smart-trade-effect";
import { UseExchangeEffect } from "./use-exchange-effect";
import { UseSmartTradeEffect } from "./use-smart-trade-effect";

export type Effect = UseSmartTradeEffect | ReplaceSmartTradeEffect | UseExchangeEffect;
