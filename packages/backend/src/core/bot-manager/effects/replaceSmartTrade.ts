import { REPLACE_SMART_TRADE } from "./common/types/effect-types";
import { ReplaceSmartTradeEffect, ReplaceSmartTradeParams } from "./common/types/replace-smart-trade-effect";
import { makeEffect } from "./utils/make-effect";


export function replaceSmartTrade(key: string, params: ReplaceSmartTradeParams): ReplaceSmartTradeEffect {
    return makeEffect(REPLACE_SMART_TRADE, params, key)
}