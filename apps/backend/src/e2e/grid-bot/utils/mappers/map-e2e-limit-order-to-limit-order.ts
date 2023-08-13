import { OrderStatusEnum } from '@bifrost/types';
import { OrderStatus, IGetLimitOrderResponse } from '@bifrost/types';
import { GridBotE2ELimitOrder } from 'src/e2e/grid-bot/orders/types';

function mapOrderStatusEnumToOrderStatusString(
  status: OrderStatusEnum,
): OrderStatus {
  if (status === OrderStatusEnum.Placed) {
    return 'open';
  } else if (status === OrderStatusEnum.Filled) {
    return 'filled';
  }

  return 'open'; // 'canceled' | 'partially_filled'
}

export function mapE2ELimitOrderToLimitOrder(
  order: GridBotE2ELimitOrder,
): IGetLimitOrderResponse {
  return {
    exchangeOrderId: 'mock',
    clientOrderId: order.clientOrderId,
    side: order.side,
    quantity: order.quantity,
    price: order.price,
    status: mapOrderStatusEnumToOrderStatusString(order.status),
    fee: 0,
    createdAt: 0,
  };
}
