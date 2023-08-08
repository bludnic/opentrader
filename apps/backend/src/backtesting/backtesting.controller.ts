import { BacktestingEndpoint } from '@bifrost/swagger';
import { composeSymbolId } from '@bifrost/tools';
import { BarSize, ExchangeCode, ICandlestick } from '@bifrost/types';
import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
  Scope,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { parseISO } from 'date-fns';
import { RunGridBotBacktestByBotIdDto } from 'src/backtesting/dto/grid-bot/run-grid-bot-backtest-by-bot-id.dto';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { CandlesticksRepository } from 'src/core/db/postgres/repositories/candlesticks.repository';
import { composeEntityId } from 'src/core/db/postgres/utils/candlesticks-history/composeEntityId';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import {
  ExchangeFactory,
  ExchangeFactorySymbol,
} from 'src/core/exchanges/exchange.factory';
import { useGridBot } from 'src/grid-bot/use-grid-bot';
import { DataSource } from 'typeorm';
import { BacktestingService } from './backtesting.service';
import { RunGridBotBacktestRequestBodyDto } from './dto/grid-bot/run-backtest/run-grid-bot-backtest-request-body.dto';
import { RunGridBotBacktestResponseBodyDto } from './dto/grid-bot/run-backtest/run-grid-bot-backtest-response-body.dto';
import { IBacktestingTrade } from './dto/types/trade/trade.interface';
import { convertSmartTradesToTrades } from './utils/convertSmartTradesToTrades';

@Controller({
  path: 'backtesting',
  scope: Scope.REQUEST,
})
@ApiTags(BacktestingEndpoint.tagName())
export class BacktestingController {
  constructor(
    private readonly backtestingService: BacktestingService,
    private readonly firestoreService: FirestoreService,
    @Inject(ExchangeFactorySymbol)
    private readonly exchangeFactory: ExchangeFactory,
    private readonly dataSource: DataSource,
    private readonly candlesticksRepo: CandlesticksRepository,
  ) {}

  @Post('/grid-bot/test')
  async runByBotId(
    @FirebaseUser() user: IUser,
    @Body() body: RunGridBotBacktestByBotIdDto,
  ): Promise<{
    candles: ICandlestick[];
    trades: IBacktestingTrade[];
    finishedSmartTradesCount: number;
    totalProfit: number;
    smartTrades: ISmartTrade[];
  }> {
    const bot = await this.firestoreService.gridBot.findOne(body.botId);

    const symbolId = composeSymbolId(
      ExchangeCode.OKX,
      bot.baseCurrency,
      bot.quoteCurrency,
    );
    const entityId = composeEntityId(symbolId, BarSize.ONE_MINUTE);

    const fromTimestamp = parseISO(body.startDate).getTime();
    const toTimestamp = parseISO(body.endDate).getTime();

    const candlesticks = await this.candlesticksRepo.findAndSort(
      entityId,
      fromTimestamp,
      toTimestamp,
    );

    if (candlesticks.length === 0) {
      throw new NotFoundException(
        `Not found candlesticks history data for ${entityId} symbol`,
      );
    }

    const backtesting = new BacktestingService();

    const { smartTrades, finishedSmartTradesCount, totalProfit } =
      await backtesting.run(bot, useGridBot, candlesticks);

    const trades = convertSmartTradesToTrades(smartTrades);

    return {
      trades,
      candles: candlesticks,
      finishedSmartTradesCount,
      totalProfit,
      smartTrades,
    };
  }

  @Post('/grid-bot/test/run')
  @ApiOperation(BacktestingEndpoint.operation('runGridBotBacktest'))
  async runTest(
    @FirebaseUser() user: IUser,
    @Body() body: RunGridBotBacktestRequestBodyDto,
  ): Promise<RunGridBotBacktestResponseBodyDto> {
    const { bot: botDto, startDate, endDate } = body;

    const bot: IGridBot = {
      ...botDto,
      gridLines: [...botDto.gridLines].sort(
        (left, right) => left.price - right.price,
      ), // @todo validation
      id: 'doesnt_matter', // @todo make a helper function
      name: 'Doesnt matter',
      initialInvestment: {
        baseCurrency: {
          price: 0,
          quantity: 0,
        },
        quoteCurrency: {
          quantity: 0,
        },
      },
      enabled: true,
      createdAt: Date.now(),
      exchangeAccountId: '1',
      userId: '0',
      smartTrades: [],
    };

    const symbolId = composeSymbolId(
      ExchangeCode.OKX,
      bot.baseCurrency,
      bot.quoteCurrency,
    );
    const entityId = composeEntityId(symbolId, BarSize.ONE_MINUTE);

    const fromTimestamp = parseISO(startDate).getTime();
    const toTimestamp = parseISO(endDate).getTime();

    const candlesticks = await this.candlesticksRepo.findAndSort(
      entityId,
      fromTimestamp,
      toTimestamp,
    );

    if (candlesticks.length === 0) {
      throw new NotFoundException(
        `Not found candlesticks history data for ${entityId} symbol`,
      );
    }

    const backtesting = new BacktestingService();

    const { smartTrades, finishedSmartTradesCount, totalProfit } =
      await backtesting.run(bot, useGridBot, candlesticks);

    const trades = convertSmartTradesToTrades(smartTrades);

    return {
      trades,
      candles: candlesticks,
      finishedSmartTradesCount,
      totalProfit,
      smartTrades,
    };
  }
}
