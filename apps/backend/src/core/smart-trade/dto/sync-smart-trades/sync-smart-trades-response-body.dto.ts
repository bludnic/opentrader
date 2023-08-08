import { SyncedSmartTradeDto } from "src/core/smart-trade/types/service/sync/synced-smart-trade.dto";

export class SyncSmartTradesResponseBodyDto {
  message: string;
  syncedSmartTrades: SyncedSmartTradeDto[];
}
