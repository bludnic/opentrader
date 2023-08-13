import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { exchangeFactory } from 'src/core/exchanges/exchange.factory';
import { SmartTradingController } from './smart-trading.controller';

@Module({
  imports: [CoreModule, HttpModule],
  exports: [],
  controllers: [SmartTradingController],
  providers: [
    Logger,
    exchangeFactory, // @todo rm experiments
  ],
})
export class SmartTradingModule {}
