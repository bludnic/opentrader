import { Injectable } from '@nestjs/common';
import { CandlestickEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlestick/candlestick.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CandlesticksRepository extends Repository<CandlestickEntity> {
  constructor(private dataSource: DataSource) {
    super(CandlestickEntity, dataSource.createEntityManager());
  }

  async findNewestTimestamp(historyId: string): Promise<number | null> {
    const aliasName = 'timestamp';

    const { timestamp } = await this.dataSource
      .getRepository(CandlestickEntity)
      .createQueryBuilder('candlestick')
      .where('candlestick.historyId = :historyId', {
        historyId,
      })
      .select('MAX(candlestick.timestamp)', aliasName)
      .getRawOne<{ [aliasName]: string | null }>();

    return isNaN(+timestamp) ? null : Number(timestamp);
  }

  async findEarliestTimestamp(historyId: string): Promise<number> {
    const aliasName = 'timestamp';

    const { timestamp } = await this.dataSource
      .getRepository(CandlestickEntity)
      .createQueryBuilder('candlestick')
      .where('candlestick.historyId = :historyId', {
        historyId,
      })
      .select('MIN(candlestick.timestamp)', aliasName)
      .getRawOne<{ [aliasName]: string | null }>();

    return isNaN(+timestamp) ? null : Number(timestamp);
  }

  findAndSort(
    historyId: string,
    fromTimestamp: number,
    toTimestamp: number,
    order: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.dataSource
      .getRepository(CandlestickEntity)
      .createQueryBuilder('candlestick')
      .where('candlestick.historyId = :historyId', {
        historyId,
      })
      .andWhere('candlestick.timestamp <= :toTimestamp', {
        toTimestamp,
      })
      .andWhere('candlestick.timestamp >= :fromTimestamp', {
        fromTimestamp,
      })
      .orderBy('timestamp', order)
      .getMany();
  }
}
