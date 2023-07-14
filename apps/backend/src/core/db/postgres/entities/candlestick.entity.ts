import { ICandlestick } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'candlestick' })
export class CandlestickEntity implements ICandlestick {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  open: number;

  @Column()
  high: number;

  @Column()
  low: number;

  @Column()
  close: number;

  @Column()
  timestamp: number;
}
