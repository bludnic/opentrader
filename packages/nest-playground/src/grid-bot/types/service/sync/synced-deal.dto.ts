import { SyncedOrderDto } from 'src/grid-bot/types/service/sync/synced-order.dto';

export class SyncedDealDto {
  dealId: string;
  buyOrder?: SyncedOrderDto;
  sellOrder?: SyncedOrderDto;
}
