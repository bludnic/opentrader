import { IGetLimitOrderResponse } from 'src/core/exchanges/types/exchange/trade/get-limit-order/get-limit-order-response.interface';

export function checkOrderFilled(order: IGetLimitOrderResponse) {
  return order.status === "filled";
}
