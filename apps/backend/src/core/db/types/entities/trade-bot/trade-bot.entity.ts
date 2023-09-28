import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

import { OrderEntity } from "./orders/order.entity";
import { IOrder } from "./orders/order.interface";
import { ITradeBot } from "./trade-bot.interface";

export class TradeBotEntity implements ITradeBot {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    baseCurrency: string; // e.g 1INCH

    @IsNotEmpty()
    @IsString()
    quoteCurrency: string; // e.g USDT

    @IsDefined()
    @IsBoolean()
    enabled: boolean;

    @IsDefined()
    @IsNumber()
    createdAt: number;

    @ApiProperty({
      type: () => OrderEntity
    })
    @ValidateNested()
    @Type(() => OrderEntity)
    orders: Record<string, IOrder>;
  
    userId: string;

    @IsDefined()
    @IsString()
    exchangeAccountId: string;

    constructor(bot: TradeBotEntity) {
      Object.assign(this, bot);
    }
}