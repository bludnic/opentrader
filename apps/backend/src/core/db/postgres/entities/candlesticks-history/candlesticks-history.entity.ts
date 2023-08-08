import { ApiProperty } from '@nestjs/swagger';
import { IsValidEntityId } from './validation/IsValidEntityId';
import { ICandlesticksHistory } from './candlesticks-history.interface';
import { CandlestickEntity } from './candlestick/candlestick.entity';
import { BarSize, ExchangeCode, ICandlestick } from '@bifrost/types';
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
  @IsValidEntityId()
  id: string; // e.g. OKX:ETH/USDT#15m

  @Column()
  baseCurrency: string;

  @Column()
  quoteCurrency: string;

  @Column()
  exchangeCode: ExchangeCode;

  @Column()
  barSize: BarSize;

  @ApiProperty({
    type: () => CandlestickEntity,
    isArray: true,
  })
  @OneToMany(() => CandlestickEntity, (candlestick) => candlestick.historyId, {
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
