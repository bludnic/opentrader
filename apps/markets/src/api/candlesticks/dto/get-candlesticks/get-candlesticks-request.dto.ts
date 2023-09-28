import { BarSize } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';
import { IsValidSymbolId } from 'src/common/validators';

export class GetCandlesticksRequestDto {
  /**
   * e.g. OKX:BTC/USDT
   */
  @ApiProperty({
    example: 'OKX:ETH/USDT',
  })
  @IsValidSymbolId()
  symbolId: string;

  @IsEnum(BarSize)
  timeframe: BarSize;

  @ApiProperty({
    description: 'Date ISO format',
    example: '2023-01-01',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Date ISO format',
    example: '2023-01-02',
  })
  @IsDateString()
  endDate: string;
}
