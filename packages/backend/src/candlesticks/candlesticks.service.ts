import { Logger } from '@nestjs/common';
import { delay } from 'src/common/helpers/delay';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { MAX_CANDLESTICKS_HISTORY_DAYS } from 'src/core/db/firestore/utils/candlesticks/constants';
import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import { daysAgoToTimestamp } from './utils/daysAgoToTimestamp';

export class CandlesticksService {
  constructor(
    private readonly firestore: FirestoreService,
    private readonly exchange: IExchangeService,
    private readonly logger: Logger,
  ) {}

  async downloadHistory(
    baseCurrency: string, quoteCurrency: string
  ): Promise<void> {
    let history = await this.firestore.candlesticksHistory.findOne(
      ExchangeCode.OKX,
      baseCurrency, quoteCurrency
    );

    // Create history object if not exists
    if (!history) {
      history = await this.firestore.candlesticksHistory.create(
        [],
        ExchangeCode.OKX,
        baseCurrency,
        quoteCurrency
      )
    }

    let newestCandleTimestamp = history.newestCandleTimestamp;
    let earliestCandleTimestamp = history.earliestCandleTimestamp;

    if (
      history.historyDataDownloadingCompleted ||
      history.newestCandleTimestamp < daysAgoToTimestamp(MAX_CANDLESTICKS_HISTORY_DAYS)
    ) {
      // Already have the history data. Fetch newest candles.
      this.logger.debug(`
        [CandlesticksService] History data for ${MAX_CANDLESTICKS_HISTORY_DAYS} days already exists, so fetch newest candles`
      )

      const candlesticks = await this.exchange.getCandlesticks({
        bar: '1m',
        symbol: this.exchange.tradingPairSymbol({
          baseCurrency,
          quoteCurrency,
        }),
        limit: 100,
        before: newestCandleTimestamp,
      });
    } else {
      // Fetching history data first
      this.logger.debug(`
        [CandlesticksService] Start fetching history data for ${MAX_CANDLESTICKS_HISTORY_DAYS} days`
      )

      let i = 0;
      while (true) {
        i++;

        this.logger.debug(`
          [CandlesticksService] Fetch candlesticks history #I: ${i}`
        )

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
          await this.firestore.candlesticksHistory.markHistoryDataAsCompleted(
            ExchangeCode.OKX,
            baseCurrency,
            quoteCurrency,
          )

          this.logger.debug(`
            [CandlesticksService] History data download completed`
          )

          break;
        } else {
          earliestCandleTimestamp = candlesticks[candlesticks.length - 1].timestamp;

          await this.firestore.candlesticksHistory.update(
            candlesticks,
            ExchangeCode.OKX,
            baseCurrency,
            quoteCurrency,
            earliestCandleTimestamp
          )
        }

        await delay(200);
      }
    }


  }
}
