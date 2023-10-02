import { exchanges, IExchange } from '@opentrader/exchanges';
import { ICandlestick } from '@opentrader/types';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CandlesticksService } from 'src/api/candlesticks/candlesticks.service';
import { MarketsService } from 'src/api/markets/markets.service';
import { stringToBarSize } from 'src/common/guards/stringToBarSize';
import { calcSince } from 'src/common/utils/candlesticks';

import {
  FETCH_CANDLESTICKS_HISTORY_CRON_JOB_FAIL_TIMEOUT,
  FETCH_CANDLESTICKS_HISTORY_CRON_JOB_NAME,
} from './constants';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly marketsService: MarketsService,
    private readonly candlesticksService: CandlesticksService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND, {
    name: FETCH_CANDLESTICKS_HISTORY_CRON_JOB_NAME,
  })
  async fetchCandlesticksHistory() {
    const job = this.schedulerRegistry.getCronJob(
      FETCH_CANDLESTICKS_HISTORY_CRON_JOB_NAME,
    );
    job.stop(); // pausing the cron job

    const { markets } = await this.marketsService.findWithNoHistory();

    if (markets.length === 0) {
      this.logger.debug(
        `No markets. Restarting the job in ${FETCH_CANDLESTICKS_HISTORY_CRON_JOB_FAIL_TIMEOUT} sec`,
      );

      setTimeout(() => {
        job.start(); // restarting the cron job
      }, FETCH_CANDLESTICKS_HISTORY_CRON_JOB_FAIL_TIMEOUT * 1000);
      return;
    }

    this.logger.debug(
      'Markets: ' +
        markets.map((market) => `${market.exchangeCode}:${market.symbol}`),
    );

    const market = markets[0];
    const { symbol, exchangeCode } = market;
    this.logger.debug(
      `Pick first market: ${market.exchangeCode}:${market.symbol}`,
    );

    this.logger.debug(
      `Timeframes: ${market.timeframes
        .map(
          (timeframe) =>
            `${timeframe.timeframe}: ${timeframe.historyEndReached}`,
        )
        .join(', ')}`,
    );

    const exchange: IExchange = exchanges[exchangeCode]();
    this.logger.debug(`${market.exchangeCode}: exchange instance created`);

    const marketTimeframe = market.timeframes.find(
      (timeframe) => !timeframe.historyEndReached,
    );

    if (!marketTimeframe) {
      this.logger.debug('No timeframes with historyReached = false');
      return;
    }

    this.logger.debug(`Using ${marketTimeframe.timeframe} timeframe`);
    const oldestCandle = await this.candlesticksService.findOldestCandlestick(
      symbol,
      exchangeCode,
      stringToBarSize(marketTimeframe.timeframe),
    );

    let oldestCandleTimestamp: Date;
    if (oldestCandle) {
      oldestCandleTimestamp = oldestCandle.timestamp;
      this.logger.debug(
        `Found oldest candle ${oldestCandleTimestamp}: ${oldestCandleTimestamp.toISOString()}`,
      );
    } else {
      oldestCandleTimestamp = new Date();
      this.logger.debug(
        'There are no candles, using current timestamp',
        oldestCandleTimestamp.getTime(),
      );
    }

    const limit = 100;
    const since = calcSince(
      oldestCandleTimestamp.getTime(),
      stringToBarSize(marketTimeframe.timeframe),
      limit,
    );
    this.logger.debug(
      `Preparing to download candles since ${since}: (${new Date(
        since,
      ).toISOString()})`,
    );

    let candlesticks: ICandlestick[];
    try {
      candlesticks = await exchange.getCandlesticks({
        symbol: market.symbol,
        bar: marketTimeframe.timeframe,
        since,
        limit,
      });
    } catch (err) {
      this.logger.error(err);

      this.logger.debug(
        `Error occurred in the exchange response. Restarting the job in ${FETCH_CANDLESTICKS_HISTORY_CRON_JOB_FAIL_TIMEOUT} sec`,
      );

      setTimeout(() => {
        job.start(); // restarting the cron job
      }, FETCH_CANDLESTICKS_HISTORY_CRON_JOB_FAIL_TIMEOUT * 1000);

      return;
    }

    this.logger.debug(`Fetched ${candlesticks.length} candlesticks`);

    if (candlesticks.length === 0) {
      this.logger.debug('History end reached');

      await this.marketsService.historyEndReached(
        symbol,
        exchangeCode,
        stringToBarSize(marketTimeframe.timeframe),
      );
    } else {
      this.logger.debug('Saving candlesticks to db...');

      await this.candlesticksService.saveAll(
        candlesticks,
        symbol,
        exchangeCode,
        stringToBarSize(marketTimeframe.timeframe),
      );
    }

    job.start(); // restarting the cron job

    return {
      market,
      candlesticks,
    };
  }
}
