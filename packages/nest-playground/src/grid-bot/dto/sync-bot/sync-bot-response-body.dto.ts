import { PlacedDealDto } from 'src/grid-bot/types/service/place/placed-deal.dto';
import { SyncedDealDto } from 'src/grid-bot/types/service/sync/synced-deal.dto';

export class SyncBotResponseBodyDto {
  message: string;
  currentAssetPrice: number;
  // synced
  filledOrders: SyncedDealDto[];
  // actions
  placedOrders: PlacedDealDto[];
}
