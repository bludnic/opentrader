import { BarSize } from '@opentrader/types';
import { Injectable } from '@nestjs/common';
import { $Enums } from '@opentrader/markets-prisma';

import { prisma } from 'src/core/prisma';

@Injectable()
export class MarketsService {
  async findAll() {
    const markets = await prisma.market.findMany();

    return {
      markets,
    };
  }

  async findAllByExchange(exchangeCode: $Enums.ExchangeCode) {
    const markets = await prisma.market.findMany({
      where: {
        exchange: {
          code: exchangeCode,
        },
      },
    });

    return {
      markets,
    };
  }

  /**
   * Get markets that required the history to be downloaded.
   */
  async findWithNoHistory() {
    const markets = await prisma.market.findMany({
      where: {
        timeframes: {
          some: {
            historyEndReached: false,
          },
        },
      },
      include: {
        timeframes: true,
      },
    });

    return {
      markets,
    };
  }

  /**
   * Get markets which history is already downloaded
   */
  async findWithHistory() {
    const markets = await prisma.market.findFirst({
      where: {
        timeframes: {
          every: {
            historyEndReached: true,
          },
        },
      },
      include: {
        timeframes: true,
      },
    });

    return {
      markets,
    };
  }

  async create(symbol: string, exchangeCode: $Enums.ExchangeCode) {
    const market = await prisma.market.create({
      data: {
        symbol,
        exchangeCode,
      },
      include: {},
    });

    return {
      market,
    };
  }

  async historyEndReached(
    symbol: string,
    exchangeCode: $Enums.ExchangeCode,
    historyEndReached: BarSize,
  ) {
    await prisma.marketTimeframe.update({
      where: {
        id: {
          timeframe: historyEndReached,
          marketSymbol: symbol,
          marketExchangeCode: exchangeCode,
        },
      },
      data: {
        historyEndReached: true,
      },
    });
  }

  async createTimeframe(
    timeframe: string,
    exchangeCode: $Enums.ExchangeCode,
    symbol: string,
  ) {
    return prisma.marketTimeframe.create({
      data: {
        timeframe,
        marketExchangeCode: exchangeCode,
        marketSymbol: symbol,
      },
    });
  }
}
