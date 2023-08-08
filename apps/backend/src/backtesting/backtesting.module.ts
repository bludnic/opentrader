import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core.module';
import { CandlestickEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlestick/candlestick.entity';
import { CandlesticksHistoryEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlesticks-history.entity';
import { CandlesticksRepository } from 'src/core/db/postgres/repositories/candlesticks.repository';
import { BacktestingController } from './backtesting.controller';
import { BacktestingService } from './backtesting.service';
import { exchangeFactory } from 'src/core/exchanges/exchange.factory';

@Module({
  imports: [
    CoreModule,
    HttpModule,
    TypeOrmModule.forFeature([CandlestickEntity, CandlesticksHistoryEntity]),
  ],
  exports: [],
  controllers: [BacktestingController],
  providers: [
    BacktestingService,
    Logger,
    exchangeFactory,
    CandlesticksRepository,
  ],
})
export class BacktestingModule {}
