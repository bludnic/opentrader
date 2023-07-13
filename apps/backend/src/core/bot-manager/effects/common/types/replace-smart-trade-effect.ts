import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface";
import { BaseEffect } from "./base-effect";
import { REPLACE_SMART_TRADE } from "./effect-types";

export type ReplaceSmartTradeParams = ISmartTrade;

export type ReplaceSmartTradePayload = ISmartTrade;

export type ReplaceSmartTradeEffect = BaseEffect<typeof REPLACE_SMART_TRADE, ReplaceSmartTradePayload, string>;