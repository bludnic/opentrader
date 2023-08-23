import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Candlestick } from './entities/candlestick.entity';
import { Exchange } from './entities/exchange.entity';
import { Market } from './entities/market.entity';

import { DbService } from './db.service';

@Module({
  imports: [TypeOrmModule.forFeature([Candlestick, Market, Exchange])],
  exports: [DbService],
  providers: [DbService],
})
export class DbModule {}
