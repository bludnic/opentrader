import { OrderStatusEnum } from "@opentrader/types";

export type Order = {
  status: OrderStatusEnum;
  price: number;
  /**
   * Creation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  createdAt: number;
  /**
   * Updated time (e.g. update status to Filled), Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  updatedAt: number;
};

type SmartTradeBase = {
  id: number | string; // @todo remove this prop, the bot processor is not required to know the ID of the bot
  ref: string;
};

export type SmartTrade = SmartTradeBase & {
  quantity: number;
  buy: Order;
  sell: Order;
};
