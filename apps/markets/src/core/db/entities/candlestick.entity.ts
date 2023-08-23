import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { BarSize } from '@bifrost/types';

import { Market } from './market.entity';
import { StringToNumberTransformer } from '../transformers';

@Entity()
export class Candlestick {
  @Column({
    primary: true,
  })
  timeframe: BarSize;

  @Column({
    type: 'bigint',
    transformer: new StringToNumberTransformer(),
    primary: true,
  })
  timestamp: number;

  @ManyToOne(() => Market, (market) => market.candlesticks)
  market: Market;
  @PrimaryColumn()
  marketSymbol: Market['symbol']; // can't set ManyToOne columns as primary https://github.com/typeorm/typeorm/issues/3238
  @PrimaryColumn()
  marketExchangeCode: Market['exchange']['code']; // can't set ManyToOne columns as primary https://github.com/typeorm/typeorm/issues/3238

  @Column({
    type: 'double precision',
  })
  open: number;

  @Column({
    type: 'double precision',
  })
  high: number;

  @Column({
    type: 'double precision',
  })
  low: number;

  @Column({
    type: 'double precision',
  })
  close: number;
}
