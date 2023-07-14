import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from 'src/core/core.module';
import { CandlestickEntity } from 'src/core/db/postgres/entities/candlestick.entity';
import { exchangeFactory } from 'src/core/exchanges/exchange.factory';
import { CandlesticksController } from './candlesticks.controller';
import { CandlesticksService } from 'src/candlesticks/candlesticks.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CoreModule,
    HttpModule,
    TypeOrmModule.forFeature([CandlestickEntity]),
  ],
  exports: [],
  providers: [exchangeFactory, CandlesticksService, Logger],
  controllers: [CandlesticksController],
})
export class CandlesticksModule {}
