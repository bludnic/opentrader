import { Module } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';

import { CandlesticksService } from './candlesticks/candlesticks.service';
import { ExchangesService } from './exchanges/exchanges.service';
import { MarketsService } from './markets/markets.service';
import { CronService } from 'src/api/cron/cron.service';

import { CandlesticksController } from './candlesticks/candlesticks.controller';
import { ExchangesController } from './exchanges/exchanges.controller';
import { MarketsController } from './markets/markets.controller';
import { CronController } from 'src/api/cron/cron.controller';

@Module({
  imports: [CoreModule],
  providers: [
    CandlesticksService,
    MarketsService,
    ExchangesService,
    CronService,
  ],
  controllers: [
    CandlesticksController,
    MarketsController,
    ExchangesController,
    CronController,
  ],
})
export class ApiModule {}
