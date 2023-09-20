import { BarSize, ICandlestick } from '@bifrost/types';
import { Injectable } from '@nestjs/common';
import { $Enums } from '@bifrost/markets-prisma';
import { prisma } from 'src/core/prisma';

@Injectable()
export class CandlesticksService {
  async create(
    open: number,
    high: number,
    low: number,
    close: number,
    timeframe: BarSize,
    timestamp: number,
    symbol: string,
    exchangeCode: $Enums.ExchangeCode,
  ) {
    const data = {
      open,
      high,
      low,
      close,
      timeframe,
      timestamp: new Date(timestamp),
      marketSymbol: symbol,
      marketExchangeCode: exchangeCode,
    };

    const candlestick = prisma.candlestick.create({
      data,
    });

    return {
      candlestick,
    };
  }

  async saveAll(
    candlesticks: ICandlestick[],
    symbol: string,
    exchangeCode: $Enums.ExchangeCode,
    timeframe: BarSize,
  ) {
    const data = candlesticks.map((candlestick) => ({
      open: candlestick.open,
      high: candlestick.high,
      low: candlestick.low,
      close: candlestick.close,
      timestamp: new Date(candlestick.timestamp),

      timeframe: timeframe,
      marketSymbol: symbol,
      marketExchangeCode: exchangeCode,
    }));

    await prisma.candlestick.createMany({
      data,
    });
  }

  async findAll(
    symbol: string,
    exchangeCode: $Enums.ExchangeCode,
    timeframe: BarSize,
    fromTimestamp: number,
    toTimestamp: number,
  ) {
    const candlesticks = await prisma.candlestick.findMany({
      select: {
        open: true,
        high: true,
        low: true,
        close: true,
        timestamp: true,
      },
      where: {
        marketSymbol: symbol,
        marketExchangeCode: exchangeCode,
        timeframe,
        AND: [
          {
            timestamp: {
              gte: new Date(fromTimestamp),
            },
          },
          {
            timestamp: {
              lte: new Date(toTimestamp),
            },
          },
        ],
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return {
      candlesticks,
    };
  }

  async findOldestCandlestick(
    symbol: string,
    exchangeCode: $Enums.ExchangeCode,
    timeframe: BarSize,
  ) {
    const candlestick = await prisma.candlestick.findFirst({
      where: {
        marketSymbol: symbol,
        marketExchangeCode: exchangeCode,
        timeframe,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return candlestick;
  }
}
