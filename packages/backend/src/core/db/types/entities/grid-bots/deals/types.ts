import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import {
  BuyOrder,
  BuyOrderFilled,
  BuyOrderIdle,
  BuyOrderPlaced,
  SellOrder,
  SellOrderFilled,
  SellOrderIdle,
  SellOrderPlaced,
} from 'src/core/db/types/entities/grid-bots/orders/types';

export type BaseDeal<
  BUY_ORDER extends BuyOrder,
  SELL_ORDER extends SellOrder,
  DEAL_STATUS extends DealStatusEnum,
> = {
  id: string;
  quantity: number;
  buyOrder: BUY_ORDER;
  sellOrder: SELL_ORDER;
  status: DEAL_STATUS;
};

export type DealIdle = BaseDeal<
  BuyOrderIdle,
  SellOrderIdle,
  DealStatusEnum.Idle
>;
export type DealBuyPlaced = BaseDeal<
  BuyOrderPlaced,
  SellOrderIdle,
  DealStatusEnum.BuyPlaced
>;
export type DealBuyFilled = BaseDeal<
  BuyOrderFilled,
  SellOrderIdle,
  DealStatusEnum.BuyFilled
>;

export type DealSellPlaced = BaseDeal<
  BuyOrderFilled,
  SellOrderPlaced,
  DealStatusEnum.SellPlaced
>;
export type DealSellFilled = BaseDeal<
  BuyOrderFilled,
  SellOrderFilled,
  DealStatusEnum.SellFilled
>;

export type IDeal =
  | DealIdle
  | DealBuyPlaced
  | DealBuyFilled
  | DealSellPlaced
  | DealSellFilled;
