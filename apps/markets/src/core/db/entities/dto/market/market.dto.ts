import { OmitType } from '@nestjs/swagger';
import { Market } from 'src/core/db/entities/market.entity';

export class MarketDto extends OmitType(Market, ['candlesticks', 'exchange']) {}
