import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { OrderStatus } from 'src/core/exchanges/types/exchange/trade/common/types/order-side.type';
import { IGetLimitOrderResponse } from 'src/core/exchanges/types/exchange/trade/get-limit-order/get-limit-order-response.interface';
import { gridBotSettings } from 'src/e2e/grid-bot/bot-settings';
import { GridBotE2ELimitOrder } from 'src/e2e/grid-bot/orders/types';

function mapOrderStatusEnumToOrderStatusString(
  status: OrderStatusEnum,
): OrderStatus {
  if (status === OrderStatusEnum.Placed) {
    return 'live';
  } else if (status === OrderStatusEnum.Filled) {
    return 'filled';
  }

  return 'live'; // 'canceled' | 'partially_filled'
}

export function mapE2ELimitOrderToLimitOrder(
  order: GridBotE2ELimitOrder,
): IGetLimitOrderResponse {
  return {
    exchangeOrderId: 'mock',
    clientOrderId: order.clientOrderId,
    side: order.side,
    quantity: gridBotSettings.quantityPerGrid,
    price: order.price,
    status: mapOrderStatusEnumToOrderStatusString(order.status),
    createdAt: 0,
  };
}
