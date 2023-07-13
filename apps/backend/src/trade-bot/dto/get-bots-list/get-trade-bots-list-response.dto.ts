import { TradeBotDto } from "src/core/db/firestore/repositories/trade-bot/dto/trade-bot.dto";

export class GetTradeBotsListResponseDto {
  bots: TradeBotDto[];
}
