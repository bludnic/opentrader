import { Logger } from "@nestjs/common";
import { ITradeBot } from "src/core/db/types/entities/trade-bot/trade-bot.interface";
import { TradeBotOrdersService } from "../trade-bot-orders.service";

export interface IBotContext {
    logger: Logger;
    ordersService: TradeBotOrdersService;
    bot: ITradeBot;
}