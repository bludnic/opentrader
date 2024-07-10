import type { OrderSideEnum } from "@opentrader/types";

export type BuyTransaction = {
  smartTradeId: number | string;
  side: OrderSideEnum.Buy;
  quantity: number;
  buy: {
    price: number;
    fee: number; // fee in quote currency
    updatedAt: number;
  };
  sell?:
    | {
        price: number;
        fee: number; // fee in quote currency
        updatedAt: number;
      }
    | undefined;
  profit: number;
};

export type SellTransaction = {
  smartTradeId: number | string;
  side: OrderSideEnum.Sell;
  quantity: number;
  buy: {
    price: number;
    fee: number; // fee in quote currency
    updatedAt: number;
  };
  sell: {
    price: number;
    fee: number; // fee in quote currency
    updatedAt: number;
  };
  profit: number; // profit is defined only if sell order was filled
};

export type Transaction = BuyTransaction | SellTransaction;

export type ActiveOrder = {
  side: OrderSideEnum;
  quantity: number;
  price?: number;
};

export type ReportResult = {
  transactions: Transaction[];
  activeOrders: ActiveOrder[];
  totalProfit: number;
};
