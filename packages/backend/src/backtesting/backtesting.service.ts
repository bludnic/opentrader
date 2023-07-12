import { useGridBot } from "src/grid-bot/use-grid-bot";
import { BotManagerService } from "../core/bot-manager/bot-manager.service";
import { TestingDb } from "./testing-db";
import { TestingExchangeService } from "./testing-exchange.service";
import { TestBotControl } from "./test-bot-control";
import { uniqId } from "src/core/db/utils/uniqId";
import { ETH_USDT } from './history/ETH_USDT_90_DAYS_REAL_ACCOUNT';
import { OrderStatusEnum } from "src/core/db/types/common/enums/order-status.enum";
import { ICandlestick } from "src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface";
import { ITrade } from "./types/trade.interface";
import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface";

export class BacktestingService {
    constructor() {}

    private createManager() {
        const db = new TestingDb()
        const botControl = new TestBotControl(db)
        const testingExchange = new TestingExchangeService()

        const manager = new BotManagerService(botControl, testingExchange)

        return {
            manager,
            db
        }
    }

    async run(candlesParam: ICandlestick[]): Promise<{
        smartTrades: ISmartTrade[],
        finishedSmartTrades: ISmartTrade[],
        finishedSmartTradesCount: number,
        totalProfit: number,
    }> {
        const candles = candlesParam.sort((left, right) => left.timestamp - right.timestamp)
        const { manager, db } = this.createManager();

        for (const [index, candle] of candles.entries()) {
            console.log(`Process candle #${index} with time #${candle.timestamp} of ${candles.length} with close price:`, candle.close)
            await manager.process(useGridBot);

            db.smartTrades.forEach(smartTrade => {
                db.markIdleAsPlaced(smartTrade.id)
            });

            db.smartTrades.forEach(smartTrade => {
                db.processSmartTrade(smartTrade.id, candle)
            })
        }

        const finishedSmartTrades = db.smartTrades.filter(
            smartTrade => smartTrade.sellOrder && smartTrade.sellOrder.status === OrderStatusEnum.Filled
        )
        const totalProfit = finishedSmartTrades.reduce((acc, curr) => {
            const priceDiff = curr.sellOrder.price - curr.buyOrder.price;
            const profit = priceDiff * curr.buyOrder.quantity;

            return acc + profit
        }, 0)
  
        console.log('run return')

        return {
          smartTrades: db.smartTrades,
          finishedSmartTrades,
          finishedSmartTradesCount: finishedSmartTrades.length,
          totalProfit: totalProfit
        }
    }
}