import { ApiProperty, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, ValidateNested } from "class-validator";
import { SmartTradeEntity } from "src/core/db/types/entities/smart-trade/smart-trade.entity";
import { CreateSmartTradeBuyOrderDto } from "./types/create-buy-order.dto";
import { CreateSmartTradeSellOrderDto } from "./types/create-sell-order.dto";

export class CreateSmartTradeDto extends PickType(SmartTradeEntity, [
  'id',
  'comment',
  'quantity',
  'baseCurrency',
  'quoteCurrency',
  'exchangeAccountId',
  'botId'
] as const) {
  @ApiProperty({
    type: () => CreateSmartTradeBuyOrderDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateSmartTradeBuyOrderDto)
  buy: CreateSmartTradeBuyOrderDto;

  @ApiProperty({
    type: () => CreateSmartTradeSellOrderDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateSmartTradeSellOrderDto)
  sell: CreateSmartTradeSellOrderDto;
}
  