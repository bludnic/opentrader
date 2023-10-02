import { Injectable } from '@nestjs/common';
import { $Enums } from '@opentrader/markets-prisma';

import { prisma } from 'src/core/prisma';

@Injectable()
export class ExchangesService {
  async create(exchangeCode: $Enums.ExchangeCode, exchangeName: string) {
    const exchange = await prisma.exchange.create({
      data: {
        code: exchangeCode,
        name: exchangeName,
      },
    });

    return {
      exchange,
    };
  }

  async findAll() {
    const exchanges = await prisma.exchange.findMany({
      include: {
        markets: true,
      },
    });

    return {
      exchanges,
    };
  }
}
