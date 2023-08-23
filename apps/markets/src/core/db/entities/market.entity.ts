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
   * Earliest candlestick timestamp.
   * Must be set when candle history reached the end.
   */
  @Column({ default: false })
  historyReached: boolean;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: string;

  @OneToMany(() => Candlestick, (candlestick) => candlestick.market)
  candlesticks: Candlestick[];
}
