import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CandlesticksServiceFactory,
  CandlesticksServiceFactorySymbol,
} from 'src/candlesticks/candlesticks-service.factory';
import { CandlesticksHistoryRepository } from 'src/core/db/postgres/repositories/candlesticks-history.repository';
import { decomposeEntityId } from 'src/core/db/postgres/utils/candlesticks-history/decomposeEntityId';

@Injectable()
export class CandlesticksCronService {
  constructor(
    @Inject(CandlesticksServiceFactorySymbol)
    private readonly candlesticksServiceFactory: CandlesticksServiceFactory,
    @Inject(CandlesticksHistoryRepository)
    private readonly candlesticksHistoryRepo: CandlesticksHistoryRepository,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
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
        `[CandlesticksCronService] Request new candlesticks for ${history.id}`,
      );

      const { symbolId, barSize } = decomposeEntityId(history.id);
      const candlesticks = await candlesticksService.downloadNewCandlesticks(
        symbolId,
        barSize,
      );

      this.logger.debug(
        `[CandlesticksCronService] Fetched ${candlesticks.length} candlesticks for ${history.id}`,
      );
    }

    this.logger.debug(`[CandlesticksCronService] Done`);
  }
}
