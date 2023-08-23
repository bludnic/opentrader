import { ExchangeCode } from '@bifrost/types';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Market } from './market.entity';

@Entity()
export class Exchange {
  @PrimaryColumn()
  code: ExchangeCode;

  @Column()
  name: string;

  @OneToMany(() => Market, (market) => market.exchange)
  markets: Market[];
}
