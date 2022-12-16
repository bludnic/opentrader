import { ApiProperty } from '@nestjs/swagger';

export class CreateBotRequestBodyDto {
  id: string;
  name: string;
  account: string; // reference
  baseCurrency: string;
  quoteCurrency: string;
  gridLevels: number;
  lowPrice: number;
  highPrice: number;
  @ApiProperty({
    title: 'Amount to buy per grid level in baseCurrency',
  })
  quantityPerGrid: number;
}
