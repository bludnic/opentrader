import { OmitType } from "@nestjs/swagger";
import { GridBotEntity } from "src/core/db/types/entities/grid-bots/grid-bot.entity";

export class BacktestGridBotDto extends OmitType(GridBotEntity, [
    'id',
    'name',
    'exchangeAccountId',
    'enabled',
    'createdAt',
    'smartTrades',
    'userId',
    'initialInvestment',
    'enabled',
    'createdAt'
] as const) {}
  