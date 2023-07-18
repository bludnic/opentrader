import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CandlesticksServiceFactory,
  CandlesticksServiceFactorySymbol,
} from 'src/candlesticks/candlesticks-service.factory';
import { CandlesticksHistoryRepository } from 'src/core/db/postgres/repositories/candlesticks-history.repository';

@Injectable()
export class CandlesticksCronService {
  constructor(
    @Inject(CandlesticksServiceFactorySymbol)
    private readonly candlesticksServiceFactory: CandlesticksServiceFactory,
    @Inject(CandlesticksHistoryRepository)
    private readonly candlesticksHistoryRepo: CandlesticksHistoryRepository,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async downloadNewCandlesticks() {
    const candlesticksService =
      await this.candlesticksServiceFactory.fromExchangeAccountId(
        'okx_real_testing',
      );

    const historyList = await this.candlesticksHistoryRepo.find({
      where: {
        historyDataDownloadingCompleted: false,
      },
    });

    for (const history of historyList) {
      this.logger.debug(
        `[CandlesticksCronService] Request new candlesticks for ${history.symbol}`,
      );

      const candlesticks = await candlesticksService.downloadNewCandlesticks(
        history.baseCurrency,
        history.quoteCurrency,
      );

      this.logger.debug(
        `[CandlesticksCronService] Fetched ${candlesticks.length} candlesticks for ${history.symbol}`,
      );
    }

    this.logger.debug(`[CandlesticksCronService] Done`);
  }
}
