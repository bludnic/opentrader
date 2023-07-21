import { Injectable } from '@nestjs/common';
import { symbolId } from 'src/core/db/postgres/utils/candlesticks-history/symbolId';
import { ExchangeCode } from '@bifrost/types';
import { DataSource, EntityNotFoundError, Repository } from 'typeorm';
import { CandlesticksHistoryEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlesticks-history.entity';

@Injectable()
export class CandlesticksHistoryRepository extends Repository<CandlesticksHistoryEntity> {
  constructor(private dataSource: DataSource) {
    super(CandlesticksHistoryEntity, dataSource.createEntityManager());
  }

  async findOrCreate(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<CandlesticksHistoryEntity> {
    const symbol = symbolId(baseCurrency, quoteCurrency);

    let history: CandlesticksHistoryEntity;

    const findOne = () => {
      return this.findOneOrFail({
        where: {
          symbol,
        },
      });
    };

    try {
      history = await findOne();
    } catch (err) {
      const isNotFoundError = err instanceof EntityNotFoundError;

      if (isNotFoundError) {
        const entity = this.create({
          symbol,
          exchangeCode: ExchangeCode.OKX,
          historyDataDownloadingCompleted: false,
          baseCurrency,
          quoteCurrency,
        });

        await this.dataSource.manager.save(entity);

        history = await findOne();
      } else {
        throw err;
      }
    }

    return history;
  }
}
