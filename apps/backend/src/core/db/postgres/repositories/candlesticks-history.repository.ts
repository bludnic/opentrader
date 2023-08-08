import { decomposeSymbolId } from '@bifrost/tools';
import { Injectable } from '@nestjs/common';
import { decomposeEntityId } from 'src/core/db/postgres/utils/candlesticks-history/decomposeEntityId';
import { DataSource, EntityNotFoundError, Repository } from 'typeorm';
import { CandlesticksHistoryEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlesticks-history.entity';

@Injectable()
export class CandlesticksHistoryRepository extends Repository<CandlesticksHistoryEntity> {
  constructor(private dataSource: DataSource) {
    super(CandlesticksHistoryEntity, dataSource.createEntityManager());
  }

  async findOrCreate(id: string): Promise<CandlesticksHistoryEntity> {
    let history: CandlesticksHistoryEntity;

    const { symbolId, barSize } = decomposeEntityId(id);
    const { baseCurrency, quoteCurrency, exchangeCode } =
      decomposeSymbolId(symbolId);

    const findOne = () => {
      return this.findOneOrFail({
        where: {
          id,
        },
      });
    };

    try {
      history = await findOne();
    } catch (err) {
      const isNotFoundError = err instanceof EntityNotFoundError;

      if (isNotFoundError) {
        const entity = this.create({
          id,
          exchangeCode,
          barSize,
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
