import { BarSize, ExchangeCode } from "@bifrost/types";
import { Injectable } from "@nestjs/common";

import { DbService } from "src/core/db/db.service";

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
      where: [{ oneMinute: false }, { oneHour: false }, { fourHours: false }],
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
        oneMinute: true,
        oneHour: true,
        fourHours: true,
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
    historyReached: BarSize,
  ) {
    const marketEntity = this.db.marketRepository.create({
      symbol,
      exchangeCode,
      oneMinute: historyReached === BarSize.ONE_MINUTE ? true : undefined,
      oneHour: historyReached === BarSize.ONE_HOUR ? true : undefined,
      fourHours: historyReached === BarSize.FOUR_HOURS ? true : undefined,
    });

    const market = await this.db.marketRepository.save(marketEntity);

    return {
      market,
    };
  }
}
