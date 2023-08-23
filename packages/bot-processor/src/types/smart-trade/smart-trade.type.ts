import { OrderStatusEnum } from "@bifrost/types";
import { SmartTradeTypeEnum } from "../../types";

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
  id: string;
  quantity: number;
};

export type SmartBuySell = SmartTradeBase & {
  type: SmartTradeTypeEnum.BuySell;
  buy: Order;
  sell: Order;
};

export type SmartBuyOnly = SmartTradeBase & {
  type: SmartTradeTypeEnum.BuyOnly;
  buy: Order;
  sell: null;
};

export type SmartSellOnly = SmartTradeBase & {
  type: SmartTradeTypeEnum.SellOnly;
  buy: null;
  sell: Order;
};

export type SmartTrade = SmartBuySell | SmartBuyOnly | SmartSellOnly;
