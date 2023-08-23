import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Candlestick } from './entities/candlestick.entity';
import { Market } from './entities/market.entity';
import { Exchange } from './entities/exchange.entity';

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(Candlestick)
    public readonly candlestickRepository: Repository<Candlestick>,
    @InjectRepository(Market)
    public readonly marketRepository: Repository<Market>,
    @InjectRepository(Exchange)
    public readonly exchangeRepository: Repository<Exchange>,
  ) {}
}
