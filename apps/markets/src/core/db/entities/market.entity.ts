import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Candlestick } from './candlestick.entity';
import { Exchange } from './exchange.entity';

@Entity()
export class Market {
  @Column({ primary: true })
  symbol: string; // e.g. BTC/USDT

  @ManyToOne(() => Exchange, (exchange) => exchange.markets)
  exchange: Exchange;
  @PrimaryColumn()
  exchangeCode: Exchange['code']; // can't set ManyToOne columns as primary https://github.com/typeorm/typeorm/issues/3238

  /**
   * Must be set to `true` when candles history of 1m timeframe reached the end.
   */
  @Column({ default: false })
  oneMinute: boolean;

  /**
   * Must be set to `true` when candles history of 1h timeframe reached the end.
   */
  @Column({ default: false })
  oneHour: boolean;

  /**
   * Must be set to `true` when candles history of 4h timeframe reached the end.
   */
  @Column({ default: false })
  fourHours: boolean;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: string;

  @OneToMany(() => Candlestick, (candlestick) => candlestick.market)
  candlesticks: Candlestick[];
}
