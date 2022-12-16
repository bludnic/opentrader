/**
 * Idle - лимит ордер не размещен, его нету на бирже
 * placed - лимит ордер размещен, но не заполнен
 * filled - лимит ордер заполнен
 */
export enum OrderStatusEnum {
  Idle = 'idle',
  Placed = 'placed',
  Filled = 'filled',
}

export enum OrderSideEnum {
  Buy = 'buy',
  Sell = 'sell',
}

export type BaseOrder<
  Side extends OrderSideEnum,
  Status extends OrderStatusEnum,
> = {
  id: string;
  price: number;
  side: Side;
  status: Status;
};

export type BuyOrderIdle = BaseOrder<OrderSideEnum.Buy, OrderStatusEnum.Idle>;

export type BuyOrderPlaced = BaseOrder<
  OrderSideEnum.Buy,
  OrderStatusEnum.Placed
>;

export type BuyOrderFilled = BaseOrder<
  OrderSideEnum.Buy,
  OrderStatusEnum.Filled
>;

export type SellOrderIdle = BaseOrder<OrderSideEnum.Sell, OrderStatusEnum.Idle>;

export type SellOrderPlaced = BaseOrder<
  OrderSideEnum.Sell,
  OrderStatusEnum.Placed
>;

export type SellOrderFilled = BaseOrder<
  OrderSideEnum.Sell,
  OrderStatusEnum.Filled
>;

export type BuyOrder = BuyOrderIdle | BuyOrderPlaced | BuyOrderFilled;
export type SellOrder = SellOrderIdle | SellOrderPlaced | SellOrderFilled;
export type Order = BuyOrder | SellOrder;

export enum DealStatusEnum {
  Idle = 'Idle',
  BuyPlaced = 'BuyPlaced',
  BuyFilled = 'BuyFilled',
  SellPlaced = 'SellPlaced',
  SellFilled = 'SellFilled',
}

export type BaseDeal<
  BUY_ORDER extends BuyOrder,
  SELL_ORDER extends SellOrder,
  DEAL_STATUS extends DealStatusEnum,
> = {
  id: string;
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
