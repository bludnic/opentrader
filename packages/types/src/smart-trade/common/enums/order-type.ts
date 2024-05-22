export const OrderType = {
  Limit: "Limit",
  Market: "Market",
} as const;

export type OrderType = (typeof OrderType)[keyof typeof OrderType];
