import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from 'src/core/core.module';
import { exchangeFactory } from 'src/core/exchanges/exchange.factory';
import { SymbolsController } from './symbols.controller';

@Module({
  imports: [CoreModule, HttpModule],
  exports: [],
  controllers: [SymbolsController],
  providers: [Logger, exchangeFactory],
})
export class SymbolsModule {}
