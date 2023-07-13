import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { ICandlestick } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';
import { ExchangeCode } from '../../common/enums/exchange-code.enum';
import { CandlestickEntity } from './candlestick/candlestick.entity';
import { ICandlesticksHistory } from './candlesticks-history.interface';

export class CandlesticksHistoryEntity implements ICandlesticksHistory {
  @IsEnum(ExchangeCode)
  @IsDefined()
  exchangeCode: ExchangeCode;

  @ApiProperty({
    type: 'array',
    items: {
      $ref: getSchemaPath(CandlestickEntity),
    },
  })
  @IsDefined()
  candlesticks: ICandlestick[];

  earliestCandleTimestamp?: number;
  newestCandleTimestamp?: number;

  historyDataDownloadingCompleted: boolean;

  updatedAt: number;

  constructor(data: ICandlesticksHistory) {
    Object.assign(this, data);
  }
}
