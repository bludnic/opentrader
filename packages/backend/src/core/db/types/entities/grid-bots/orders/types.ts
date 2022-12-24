import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';

export type BaseOrder<
  Side extends OrderSideEnum,
  Status extends OrderStatusEnum,
> = {
  clientOrderId: string; // generated uniq id for exchange
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
