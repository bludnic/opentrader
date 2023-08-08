import { OmitType } from "@nestjs/swagger";
import { TradeBotEntity } from "src/core/db/types/entities/trade-bot/trade-bot.entity";

export class CreateTradeBotDto extends OmitType(TradeBotEntity, [
  'enabled',
  'createdAt',
  'orders',
  'userId',
] as const) {}
