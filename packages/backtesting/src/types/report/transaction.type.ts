import { OrderSideEnum } from "@bifrost/types";

export type BuyTransaction = {
  smartTradeId: string;
  side: OrderSideEnum.Buy;
  quantity: number;
  buy: {
    price: number;
    fee: number; // fee in quote currency
    updateAt: number;
  };
  sell?: {
    price: number;
    fee: number; // fee in quote currency
    updateAt: number;
  };
  profit: number;
};

export type SellTransaction = {
  smartTradeId: string;
  side: OrderSideEnum.Sell;
  quantity: number;
  buy: {
    price: number;
    fee: number; // fee in quote currency
    updateAt: number;
  };
  sell: {
    price: number;
    fee: number; // fee in quote currency
    updateAt: number;
  };
  profit: number; // profit is defined only if sell order was filled
};

export type Transaction = BuyTransaction | SellTransaction;
