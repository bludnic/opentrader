import { SmartTradeDto } from "src/core/db/firestore/repositories/smart-trade/dto/smart-trade.dto";

export class GetSmartTradesListResponseDto {
  smartTrades: SmartTradeDto[];
}
