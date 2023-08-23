import { Backtesting } from '@bifrost/backtesting';
import { BotTemplate } from '@bifrost/bot-processor';
import { arithmeticGridBot } from '@bifrost/bot-templates';
import { composeSymbolId } from '@bifrost/tools';
import { BarSize, ExchangeCode } from '@bifrost/types';
import { Injectable, NotFoundException } from '@nestjs/common';

import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { MarketsApiService } from 'src/shared/markets-api/markets-api.service';

@Injectable()
export class BacktestingService {
  constructor(private readonly marketsApi: MarketsApiService) {}

  async run(
    bot: IGridBot,
    template: BotTemplate<IGridBot>,
    exchangeCode: ExchangeCode,
    startDate: string,
    endDate: string,
  ) {
    const {
      data: { candlesticks },
    } = await this.marketsApi.candlesticks.getCandlesticks({
      symbolId: composeSymbolId(
        exchangeCode,
        bot.baseCurrency,
        bot.quoteCurrency,
      ),
      timeframe: BarSize.ONE_MINUTE,
      startDate,
      endDate,
    });

    if (candlesticks.length === 0) {
      throw new NotFoundException(
        `Not found candlesticks history data for ${`${bot.baseCurrency}/${bot.quoteCurrency}`} symbol`,
      );
    }

    const botProcessor = new Backtesting(bot);

    const report = await botProcessor.run(arithmeticGridBot, candlesticks);

    return report;
  }

  async runByBotConfig() {}
}
