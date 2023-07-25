import { ApiProperty } from '@nestjs/swagger';
import { ICandlesticksHistory } from './candlesticks-history.interface';
import { CandlestickEntity } from './candlestick/candlestick.entity';
import { ExchangeCode, ICandlestick } from '@bifrost/types';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'candlesticks_history' })
export class CandlesticksHistoryEntity implements ICandlesticksHistory {
  @PrimaryColumn()
  symbol: string; // e.g. ETH/USDT

  @Column()
  baseCurrency: string;

  @Column()
  quoteCurrency: string;

  @Column()
  exchangeCode: ExchangeCode;

  @ApiProperty({
    type: () => CandlestickEntity,
    isArray: true,
  })
  @OneToMany(() => CandlestickEntity, (candlestick) => candlestick.symbol, {
    cascade: true,
  })
  candlesticks: ICandlestick[];

  @Column()
  historyDataDownloadingCompleted: boolean;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: number;
}
