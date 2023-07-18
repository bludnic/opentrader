import { Logger } from '@nestjs/common';
import { delay } from 'src/common/helpers/delay';
import { MAX_CANDLESTICKS_HISTORY_DAYS } from 'src/core/db/firestore/utils/candlesticks/constants';
import { CandlestickEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlestick/candlestick.entity';
import { CandlesticksHistoryEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlesticks-history.entity';
import { CandlesticksHistoryRepository } from 'src/core/db/postgres/repositories/candlesticks-history.repository';
import { CandlesticksRepository } from 'src/core/db/postgres/repositories/candlesticks.repository';
import { symbolId } from 'src/core/db/postgres/utils/candlesticks-history/symbolId';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import { ICandlestick } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';
import { DataSource } from 'typeorm';
import { daysAgoToTimestamp } from './utils/daysAgoToTimestamp';

export class CandlesticksService {
  constructor(
    private readonly exchange: IExchangeService,
    private readonly logger: Logger,
    public readonly candlesticksHistory: CandlesticksHistoryRepository,
    public readonly candlestick: CandlesticksRepository,
    private readonly dataSource: DataSource,
  ) {}

  async downloadHistory(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<void> {
    const symbol = symbolId(baseCurrency, quoteCurrency);
    const history = await this.candlesticksHistory.findOrCreate(
      baseCurrency,
      quoteCurrency,
    );

    const newestCandleTimestamp = await this.candlestick.findNewestTimestamp(
      symbol,
    );
    const earliestCandleTimestamp =
      await this.candlestick.findEarliestTimestamp(symbol);

    const timestampInThePast = daysAgoToTimestamp(
      MAX_CANDLESTICKS_HISTORY_DAYS,
    );

    const noHistoryData =
      newestCandleTimestamp === null || earliestCandleTimestamp === null;
    const historyAlreadyDownloaded =
      history.historyDataDownloadingCompleted ||
      timestampInThePast >= earliestCandleTimestamp;

    if (noHistoryData || historyAlreadyDownloaded) {
      await this.downloadNewCandlesticks(baseCurrency, quoteCurrency);
    } else {
      await this.downloadOldCandlesticks(baseCurrency, quoteCurrency);
    }
  }

  public async downloadNewCandlesticks(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<ICandlestick[]> {
    // Already have the history data. Fetch newest candles.
    this.logger.debug(`
        [CandlesticksService] Downloading new candlesticks`);

    const symbol = symbolId(baseCurrency, quoteCurrency);

    const newestCandleTimestamp = await this.candlestick.findNewestTimestamp(
      symbol,
    );

    const candlesticks = await this.exchange.getCandlesticks({
      bar: '1m',
      symbol: this.exchange.tradingPairSymbol({
        baseCurrency,
        quoteCurrency,
      }),
      limit: 100,
      before: newestCandleTimestamp,
    });

    if (candlesticks.length > 0) {
      await this.dataSource.manager.save(
        CandlestickEntity,
        candlesticks.map((candlestick) => {
          return Object.assign(new CandlestickEntity(), {
            ...candlestick,
            symbol,
          });
        }),
      );

      this.logger.debug(
        `[CandlesticksService] Saved ${candlesticks.length} new candlesticks`,
        candlesticks,
      );
    } else {
      this.logger.debug(
        `[CandlesticksService] No new candlesticks. Nothing to save`,
      );
    }

    return candlesticks;
  }

  private async downloadOldCandlesticks(
    baseCurrency: string,
    quoteCurrency: string,
  ) {
    // Fetching history data back in time
    this.logger.debug(`
        [CandlesticksService] Downloading history candlesticks for ${MAX_CANDLESTICKS_HISTORY_DAYS} days`);

    const symbol = symbolId(baseCurrency, quoteCurrency);

    let earliestCandleTimestamp = await this.candlestick.findEarliestTimestamp(
      symbol,
    );

    const timestampInThePast = daysAgoToTimestamp(
      MAX_CANDLESTICKS_HISTORY_DAYS,
    );

    while (
      earliestCandleTimestamp === null ||
      timestampInThePast < earliestCandleTimestamp
    ) {
      this.logger.debug(`
          [CandlesticksService] Fetch candlesticks history for ${earliestCandleTimestamp} -> ${timestampInThePast}`);

      const history = await this.candlesticksHistory.findOneOrFail({
        where: {
          symbol,
        },
      });

      earliestCandleTimestamp = await this.candlestick.findEarliestTimestamp(
        symbol,
      );

      const candlesticks = await this.exchange.getCandlesticks({
        bar: '1m',
        symbol: this.exchange.tradingPairSymbol({
          baseCurrency,
          quoteCurrency,
        }),
        limit: 100,
        after: earliestCandleTimestamp,
      });

      if (candlesticks.length === 0) {
        await this.dataSource.manager.save(CandlesticksHistoryEntity, {
          ...history,
          historyDataDownloadingCompleted: true,
        });

        this.logger.debug(`
            [CandlesticksService] History data download completed`);

        break;
      } else {
        earliestCandleTimestamp =
          candlesticks[candlesticks.length - 1].timestamp;

        await this.dataSource.manager.save(
          CandlestickEntity,
          candlesticks.map((candlestick) => {
            return Object.assign(new CandlestickEntity(), {
              ...candlestick,
              symbol: history.symbol,
            });
          }),
        );
      }

      this.logger.debug(
        `[CandlesticksService] Saved ${candlesticks.length} candlesticks`,
      );

      await delay(200);
    }
  }
}
