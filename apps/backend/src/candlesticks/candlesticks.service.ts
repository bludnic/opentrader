import { decomposeSymbolId } from '@bifrost/tools';
import { Logger } from '@nestjs/common';
import { delay } from 'src/common/helpers/delay';
import { MAX_CANDLESTICKS_HISTORY_DAYS } from 'src/core/db/firestore/utils/candlesticks/constants';
import { CandlestickEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlestick/candlestick.entity';
import { CandlesticksHistoryEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlesticks-history.entity';
import { CandlesticksHistoryRepository } from 'src/core/db/postgres/repositories/candlesticks-history.repository';
import { CandlesticksRepository } from 'src/core/db/postgres/repositories/candlesticks.repository';
import { composeEntityId } from 'src/core/db/postgres/utils/candlesticks-history/composeEntityId';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import { BarSize, ICandlestick } from '@bifrost/types';
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

  async downloadHistory(symbolId: string, barSize: BarSize): Promise<void> {
    const entityId = composeEntityId(symbolId, barSize);

    const history = await this.candlesticksHistory.findOrCreate(entityId);

    const newestCandleTimestamp = await this.candlestick.findNewestTimestamp(
      entityId,
    );
    const earliestCandleTimestamp =
      await this.candlestick.findEarliestTimestamp(entityId);

    const timestampInThePast = daysAgoToTimestamp(
      MAX_CANDLESTICKS_HISTORY_DAYS,
    );

    const noHistoryData =
      newestCandleTimestamp === null || earliestCandleTimestamp === null;
    const historyAlreadyDownloaded =
      history.historyDataDownloadingCompleted ||
      timestampInThePast >= earliestCandleTimestamp;

    if (noHistoryData || historyAlreadyDownloaded) {
      await this.downloadNewCandlesticks(symbolId, barSize);
    } else {
      await this.downloadOldCandlesticks(symbolId, barSize);
    }
  }

  public async downloadNewCandlesticks(
    symbolId: string,
    barSize: BarSize,
  ): Promise<ICandlestick[]> {
    // Already have the history data. Fetch newest candles.
    this.logger.debug(`
        [CandlesticksService] Downloading new candlesticks`);

    const historyId = composeEntityId(symbolId, barSize);
    const { baseCurrency, quoteCurrency } = decomposeSymbolId(symbolId);

    const newestCandleTimestamp = await this.candlestick.findNewestTimestamp(
      historyId,
    );

    const candlesticks = await this.exchange.getCandlesticks({
      bar: barSize,
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
            historyId,
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

  private async downloadOldCandlesticks(symbolId: string, barSize: BarSize) {
    // Fetching history data back in time
    this.logger.debug(`
        [CandlesticksService] Downloading history candlesticks for ${MAX_CANDLESTICKS_HISTORY_DAYS} days`);

    const historyId = composeEntityId(symbolId, barSize);
    const { baseCurrency, quoteCurrency } = decomposeSymbolId(symbolId);

    let earliestCandleTimestamp = await this.candlestick.findEarliestTimestamp(
      historyId,
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
          id: historyId,
        },
      });

      earliestCandleTimestamp = await this.candlestick.findEarliestTimestamp(
        historyId,
      );

      const candlesticks = await this.exchange.getCandlesticks({
        bar: barSize,
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
              historyId: history.id,
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
