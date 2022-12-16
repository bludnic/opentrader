import { IGetLimitOrderResponse } from 'src/core/exchanges/okx/types/exchange/trade/get-limit-order/get-limit-order-response.interface';

export function checkOrderFilled(order: IGetLimitOrderResponse) {
  return order.quantity === order.filledQuantity;
}
