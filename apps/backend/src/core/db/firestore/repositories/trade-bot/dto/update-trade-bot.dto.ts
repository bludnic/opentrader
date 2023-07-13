import { PartialType, PickType } from "@nestjs/swagger";
import { TradeBotEntity } from "src/core/db/types/entities/trade-bot/trade-bot.entity";

export class UpdateTradeBotDto extends PartialType(
  PickType(TradeBotEntity, [
    'name',
    'enabled',
    'orders',
  ])
) {}
