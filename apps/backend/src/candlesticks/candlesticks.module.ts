import { Logger, Module } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { exchangeFactory } from 'src/core/exchanges/exchange.factory';
import { CandlesticksController } from './candlesticks.controller';
import { CandlesticksService } from 'src/candlesticks/candlesticks.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CoreModule, HttpModule],
  exports: [],
  providers: [exchangeFactory, CandlesticksService, Logger],
  controllers: [CandlesticksController],
})
export class CandlesticksModule {}
