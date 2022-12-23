import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';

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
