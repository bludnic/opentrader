export const OrderStatusEnum = {
  Idle: "idle",
  Placed: "placed",
  Filled: "filled",
} as const;

export type OrderStatusEnum =
  (typeof OrderStatusEnum)[keyof typeof OrderStatusEnum];
