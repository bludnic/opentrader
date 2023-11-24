import type { IGridLine, IGridBotLevel } from "@opentrader/types";
import { OrderStatusEnum } from "@opentrader/types";

export const ORDER_QUANTITY = 20;

export const GRID_LINES: IGridLine[] = [
  { price: 10, quantity: ORDER_QUANTITY },
  { price: 12, quantity: ORDER_QUANTITY },
  { price: 14, quantity: ORDER_QUANTITY },
  { price: 16, quantity: ORDER_QUANTITY },
  { price: 18, quantity: ORDER_QUANTITY },
  { price: 20, quantity: ORDER_QUANTITY },
];

export const GRID_LEVELS: IGridBotLevel[] = [
  {
    buy: { price: 10, status: OrderStatusEnum.Idle, quantity: ORDER_QUANTITY },
    sell: { price: 12, status: OrderStatusEnum.Idle, quantity: ORDER_QUANTITY },
  },
  {
    buy: { price: 12, status: OrderStatusEnum.Idle, quantity: ORDER_QUANTITY },
    sell: { price: 14, status: OrderStatusEnum.Idle, quantity: ORDER_QUANTITY },
  },
  {
    buy: {
      price: 14,
      status: OrderStatusEnum.Filled,
      quantity: ORDER_QUANTITY,
    },
    sell: { price: 16, status: OrderStatusEnum.Idle, quantity: ORDER_QUANTITY },
  },
  {
    buy: {
      price: 16,
      status: OrderStatusEnum.Filled,
      quantity: ORDER_QUANTITY,
    },
    sell: { price: 18, status: OrderStatusEnum.Idle, quantity: ORDER_QUANTITY },
  },
  {
    buy: {
      price: 18,
      status: OrderStatusEnum.Filled,
      quantity: ORDER_QUANTITY,
    },
    sell: { price: 20, status: OrderStatusEnum.Idle, quantity: ORDER_QUANTITY },
  },
];

// 3 Sell Orders
export const BASE_CURRENCY_INVESTMENT =
  ORDER_QUANTITY + ORDER_QUANTITY + ORDER_QUANTITY;
// 2 Buy Orders
export const QUOTE_CURRENCY_INVESTMENT =
  12 * ORDER_QUANTITY + 10 * ORDER_QUANTITY;

export const CURRENT_ASSET_PRICE = 14.5;
