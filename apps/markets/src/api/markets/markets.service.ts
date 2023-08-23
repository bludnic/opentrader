import { ExchangeCode } from '@bifrost/types';
import { Injectable } from '@nestjs/common';

import { DbService } from 'src/core/db/db.service';

@Injectable()
export class MarketsService {
  constructor(private readonly db: DbService) {}

  async findAll() {
    const markets = await this.db.marketRepository.find();

    return {
      markets,
    };
  }

  async findAllByExchange(exchangeCode: ExchangeCode) {
    const markets = await this.db.marketRepository.find({
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
    const markets = await this.db.marketRepository.find({
      where: {
        historyReached: false,
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
    const markets = await this.db.marketRepository.find({
      where: {
        historyReached: true,
      },
    });

    return {
      markets,
    };
  }

  async create(symbol: string, exchangeCode: ExchangeCode) {
    const marketEntity = this.db.marketRepository.create({
      symbol,
      exchangeCode,
    });

    const market = await this.db.marketRepository.save(marketEntity);

    return {
      market,
    };
  }

  async update(
    symbol: string,
    exchangeCode: ExchangeCode,
    historyReached: boolean,
  ) {
    const marketEntity = this.db.marketRepository.create({
      symbol,
      exchangeCode,
      historyReached,
    });

    const market = await this.db.marketRepository.save(marketEntity);

    return {
      market,
    };
  }
}
