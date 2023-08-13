import { SyncedSmartTradeOrderDto } from './synced-smart-trade-order.dto';

export class SyncedSmartTradeDto {
  smartTradeId: string;
  buyOrder?: SyncedSmartTradeOrderDto;
  sellOrder?: SyncedSmartTradeOrderDto;
}
