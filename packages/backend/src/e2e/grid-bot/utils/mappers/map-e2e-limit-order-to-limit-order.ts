import { OrderSideEnum, OrderStatusEnum } from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
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

function isE2EOrderFilled(
  orderPrice: number,
  orderSide: OrderSideEnum,
  currentAssetPrice: number,
) {
  if (orderSide === OrderSideEnum.Buy) {
    return currentAssetPrice <= orderPrice;
  }

  return currentAssetPrice >= orderPrice;
}

export function mapE2ELimitOrderToLimitOrder(
  order: GridBotE2ELimitOrder,
  currentAssetPrice: number,
): IGetLimitOrderResponse {
  return {
    exchangeOrderId: 'mock',
    clientOrderId: order.clientOrderId,
    side: order.side,
    quantity: gridBotSettings.quantityPerGrid,
    filledQuantity: isE2EOrderFilled(order.price, order.side, currentAssetPrice)
      ? gridBotSettings.quantityPerGrid
      : 0, // эмулируем заполняемость ордера
    price: order.price,
    status: mapOrderStatusEnumToOrderStatusString(order.status),
    createdAt: 0,
  };
}
