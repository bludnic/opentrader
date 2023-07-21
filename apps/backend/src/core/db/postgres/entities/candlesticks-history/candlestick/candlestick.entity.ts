import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { StringToNumberTransformer } from '../../../transformers/string-to-number.transformer';
import { ICandlesticksHistory } from '../candlesticks-history.interface';
import { CandlesticksHistoryEntity } from '../candlesticks-history.entity';
import { ICandlestick } from '../../../../../exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';

@Entity({ name: 'candlestick' })
export class CandlestickEntity implements ICandlestick {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({
    type: 'bigint',
    transformer: new StringToNumberTransformer(),
    nullable: false,
  })
  timestamp: number;

  @Column({
    type: 'float8',
  })
  open: number;

  @Column({
    type: 'float8',
  })
  high: number;

  @Column({
    type: 'float8',
  })
  low: number;

  @Column({
    type: 'float8',
  })
  close: number;

  @ManyToOne(
    () => CandlesticksHistoryEntity,
    (history) => history.candlesticks,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'symbol',
    referencedColumnName: 'symbol',
  })
  @CreateDateColumn()
  symbol: ICandlesticksHistory;
}
