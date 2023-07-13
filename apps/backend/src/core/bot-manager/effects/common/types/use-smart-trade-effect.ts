import { CreateSmartTradeRequestBodyDto } from "src/core/smart-trade/dto/create-smart-trade/create-smart-trade-request-body.dto";
import { BaseEffect } from "./base-effect";
import { USE_SMART_TRADE } from "./effect-types";

export type UseSmartTradeParams = {
    buy: number;
    sell: number;
    quantity: number;
    baseCurrency: string;
    quoteCurrency: string;
}

export type UseSmartTradePayload = Omit<
    CreateSmartTradeRequestBodyDto,
    'botId' | 'exchangeAccountId'
>;

export type UseSmartTradeEffect = BaseEffect<typeof USE_SMART_TRADE, UseSmartTradePayload, string>;