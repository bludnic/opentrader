import { OrderSideEnum } from "../../../common/enums/order-side.enum";
import { OrderStatusEnum } from "../../../common/enums/order-status.enum";

export type BaseSmartOrder<
  Side extends OrderSideEnum,
  Status extends OrderStatusEnum,
> = {
   /**
    * Exchange-supplied order ID.
    */
    exchangeOrderId: string;
    /**
     * Client-supplied order ID
     */
    clientOrderId: string;
    side: Side;
    /**
     * Quantity to buy or sell.
     */
    quantity: number;
    /**
     * Order price.
     */
    price: number;
    /**
     * Order status.
     */
    status: Status;
    /**
     * `0` if order is not filled yet
     */
    fee: number;
    /**
     * Creation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
     */
    createdAt: number;
};

export type SmartBuyOrderIdle = BaseSmartOrder<OrderSideEnum.Buy, OrderStatusEnum.Idle>;

export type SmartBuyOrderPlaced = BaseSmartOrder<
  OrderSideEnum.Buy,
  OrderStatusEnum.Placed
>;

export type SmartBuyOrderFilled = BaseSmartOrder<
  OrderSideEnum.Buy,
  OrderStatusEnum.Filled
>;

export type SmartSellOrderIdle = BaseSmartOrder<OrderSideEnum.Sell, OrderStatusEnum.Idle>;

export type SmartSellOrderPlaced = BaseSmartOrder<
  OrderSideEnum.Sell,
  OrderStatusEnum.Placed
>;

export type SmartSellOrderFilled = BaseSmartOrder<
  OrderSideEnum.Sell,
  OrderStatusEnum.Filled
>;

export type SmartBuyOrder = SmartBuyOrderIdle | SmartBuyOrderPlaced | SmartBuyOrderFilled;
export type SmartSellOrder = SmartSellOrderIdle | SmartSellOrderPlaced | SmartSellOrderFilled;
export type SmartOrder = SmartBuyOrder | SmartSellOrder;