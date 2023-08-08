import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandlesticksCronService } from 'src/candlesticks/candlesticks-cron.service';
import { candlesticksServiceFactory } from 'src/candlesticks/candlesticks-service.factory';

import { CoreModule } from 'src/core/core.module';
import { CandlestickEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlestick/candlestick.entity';
import { CandlesticksHistoryEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlesticks-history.entity';
import { CandlesticksHistoryRepository } from 'src/core/db/postgres/repositories/candlesticks-history.repository';
import { CandlesticksRepository } from 'src/core/db/postgres/repositories/candlesticks.repository';
import { exchangeFactory } from 'src/core/exchanges/exchange.factory';
import { CandlesticksController } from './candlesticks.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CoreModule,
    HttpModule,
    TypeOrmModule.forFeature([CandlestickEntity, CandlesticksHistoryEntity]),
  ],
  exports: [],
  providers: [
    exchangeFactory,
    candlesticksServiceFactory,
    Logger,
    CandlesticksRepository,
    CandlesticksHistoryRepository,
    CandlesticksCronService,
  ],
  controllers: [CandlesticksController],
})
export class CandlesticksModule {}
