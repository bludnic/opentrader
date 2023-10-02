import { OrderSideEnum } from "@opentrader/types";

export type BuyTransaction = {
  smartTradeId: number | string;
  side: OrderSideEnum.Buy;
  quantity: number;
  buy: {
    price: number;
    fee: number; // fee in quote currency
    updatedAt: number;
  };
  sell?: {
    price: number;
    fee: number; // fee in quote currency
    updatedAt: number;
  };
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
