import { OrderSideEnum, OrderStatusEnum } from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';

export type GridBotE2EActionBuyOrder = {
  side: 'buy';
  price: number; // grid price;
};

export type GridBotE2EActionSellOrder = {
  side: 'sell';
  price: number; // grid price;
};

export type GridBotE2EActionOrder =
  | GridBotE2EActionBuyOrder
  | GridBotE2EActionSellOrder;

export type GridBotE2ELimitOrder = {
  clientOrderId: string;
  status: OrderStatusEnum;
  side: OrderSideEnum;
  price: number;
};