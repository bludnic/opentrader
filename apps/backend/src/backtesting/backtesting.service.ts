import { IBotControl } from 'src/core/bot-manager/types/bot-control.interface';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { BotManagerService } from '../core/bot-manager/bot-manager.service';
import { TestingDb } from './testing-db';
import { TestingExchangeService } from './testing-exchange.service';
import { TestBotControl } from './test-bot-control';
import { OrderStatusEnum, ICandlestick } from '@bifrost/types';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';

export class BacktestingService {
  private createManager(bot: IGridBot) {
    const db = new TestingDb();
    const botControl = new TestBotControl(db, bot);
    const testingExchange = new TestingExchangeService();

    const manager = new BotManagerService(botControl, testingExchange);

    return {
      manager,
      db,
    };
  }

  async run(
    bot: IGridBot,
    botControl: (bot: IBotControl) => Generator,
    candles: ICandlestick[],
  ): Promise<{
    smartTrades: ISmartTrade[];
    finishedSmartTrades: ISmartTrade[];
    finishedSmartTradesCount: number;
    totalProfit: number;
  }> {
    const { manager, db } = this.createManager(bot);

    for (const [index, candle] of candles.entries()) {
      console.log(
        `Process candle #${index} with time #${candle.timestamp} of ${candles.length} with close price:`,
        candle.close,
      );
      await manager.process(botControl);

      db.smartTrades.forEach((smartTrade) => {
        db.markIdleAsPlaced(smartTrade.id);
      });

      db.smartTrades.forEach((smartTrade) => {
        db.processSmartTrade(smartTrade.id, candle);
      });
    }

    const finishedSmartTrades = db.smartTrades.filter(
      (smartTrade) =>
        smartTrade.sellOrder &&
        smartTrade.sellOrder.status === OrderStatusEnum.Filled,
    );
    const totalProfit = finishedSmartTrades.reduce((acc, curr) => {
      const priceDiff = curr.sellOrder.price - curr.buyOrder.price;
      const profit = priceDiff * curr.buyOrder.quantity;

      return acc + profit;
    }, 0);

    console.log('run return');

    return {
      smartTrades: db.smartTrades,
      finishedSmartTrades,
      finishedSmartTradesCount: finishedSmartTrades.length,
      totalProfit: totalProfit,
    };
  }
}
