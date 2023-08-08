import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';

export type BaseOrder<
  Side extends OrderSideEnum,
  Status extends OrderStatusEnum,
> = {
  clientOrderId: string; // generated uniq id for exchange
  price: number;
  /**
   * `0` if order is not filled yet
   */
  fee: number;
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
