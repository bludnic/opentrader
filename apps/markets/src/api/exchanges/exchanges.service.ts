import { ExchangeCode } from '@bifrost/types';
import { Injectable } from '@nestjs/common';

import { DbService } from 'src/core/db/db.service';

@Injectable()
export class ExchangesService {
  constructor(private readonly db: DbService) {}

  async create(exchangeCode: ExchangeCode, exchangeName: string) {
    const exchangeEntity = this.db.exchangeRepository.create({
      code: exchangeCode,
      name: exchangeName,
    });

    const exchange = await this.db.exchangeRepository.save(exchangeEntity);

    return {
      exchange,
    };
  }

  async findAll() {
    const exchanges = await this.db.exchangeRepository.find({
      relations: {
        markets: true,
      },
    });

    return {
      exchanges,
    };
  }
}
