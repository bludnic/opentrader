import { OrderSideEnum, OrderStatusEnum } from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
import { GridBotE2ELimitOrder } from './types';

function limitOrder(
  clientOrderId: string,
  price: number,
  side: OrderSideEnum,
  status: OrderStatusEnum,
): GridBotE2ELimitOrder {
  return {
    clientOrderId,
    status,
    side,
    price,
  };
}

export function buyPlaced(
  clientOrderId: string,
  buyPrice: number,
  sellPrice: number,
) {
  return limitOrder(
    clientOrderId,
    buyPrice,
    OrderSideEnum.Buy,
    OrderStatusEnum.Placed,
  );
}

export function buyFilled(
  clientOrderId: string,
  buyPrice: number,
  sellPrice: number,
) {
  return limitOrder(
    clientOrderId,
    buyPrice,
    OrderSideEnum.Buy,
    OrderStatusEnum.Filled,
  );
}

export function sellPlaced(
  clientOrderId: string,
  buyPrice: number,
  sellPrice: number,
) {
  return limitOrder(
    clientOrderId,
    sellPrice,
    OrderSideEnum.Sell,
    OrderStatusEnum.Placed,
  );
}

export function sellFilled(
  clientOrderId: string,
  buyPrice: number,
  sellPrice: number,
) {
  return limitOrder(
    clientOrderId,
    sellPrice,
    OrderSideEnum.Sell,
    OrderStatusEnum.Filled,
  );
}
