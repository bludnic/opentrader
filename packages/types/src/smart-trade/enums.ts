export enum OrderSideEnum {
  Buy = "buy",
  Sell = "sell",
}

export const OrderStatusEnum = {
  Idle: "idle",
  Placed: "placed",
  Filled: "filled",
} as const;

export type OrderStatusEnum =
  (typeof OrderStatusEnum)[keyof typeof OrderStatusEnum];

export const OrderType = {
  Limit: "Limit",
  Market: "Market",
} as const;

export type OrderType = (typeof OrderType)[keyof typeof OrderType];
