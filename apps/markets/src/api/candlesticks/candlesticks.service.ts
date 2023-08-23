import { BarSize, ExchangeCode, ICandlestick } from '@bifrost/types';
import { Injectable } from '@nestjs/common';
import { Between, DeepPartial, MoreThanOrEqual } from 'typeorm';

import { DbService } from 'src/core/db/db.service';
import { Candlestick } from 'src/core/db/entities/candlestick.entity';

@Injectable()
export class CandlesticksService {
  constructor(private readonly db: DbService) {}

  async create(
    open: number,
    high: number,
    low: number,
    close: number,
    timeframe: BarSize,
    timestamp: number,
    symbol: string,
    exchangeCode: ExchangeCode,
  ) {
    const candlestickEntity = this.db.candlestickRepository.create({
      open,
      high,
      low,
      close,
      timeframe,
      timestamp,
      marketSymbol: symbol,
      marketExchangeCode: exchangeCode,
    });

    const candlestick = await this.db.candlestickRepository.save(
      candlestickEntity,
    );

    return {
      candlestick,
    };
  }

  async saveAll(
    candlesticks: ICandlestick[],
    symbol: string,
    exchangeCode: ExchangeCode,
    timeframe: BarSize,
  ) {
    const entitiesArg: DeepPartial<Candlestick>[] = candlesticks.map(
      (candlestick) => ({
        open: candlestick.open,
        high: candlestick.high,
        low: candlestick.low,
        close: candlestick.close,
        timestamp: candlestick.timestamp,
        timeframe: timeframe,
        marketSymbol: symbol,
        marketExchangeCode: exchangeCode,
      }),
    );
    const entities = this.db.candlestickRepository.create(entitiesArg);

    await this.db.candlestickRepository.save(entities);
  }

  async findAll(
    symbol: string,
    exchangeCode: ExchangeCode,
    timeframe: BarSize,
    fromTimestamp: number,
    toTimestamp: number,
  ) {
    const candlesticks = await this.db.candlestickRepository.find({
      select: ['open', 'high', 'low', 'close', 'timestamp'],
      where: {
        marketSymbol: symbol,
        marketExchangeCode: exchangeCode,
        timeframe,
        timestamp: Between(fromTimestamp, toTimestamp),
      },
      order: {
        timestamp: 'ASC',
      },
      // take: limit,
    });

    return {
      candlesticks,
    };
  }

  async findOldestCandlestick(
    symbol: string,
    exchangeCode: ExchangeCode,
    timeframe: BarSize,
  ): Promise<Candlestick | null> {
    const candlestick = await this.db.candlestickRepository.findOne({
      where: {
        marketSymbol: symbol,
        marketExchangeCode: exchangeCode,
        timeframe,
      },
      order: {
        timestamp: 'ASC',
      },
    });

    return candlestick;
  }
}
