import {
  IPlaceLimitOrderRequest,
  IPlaceLimitOrderResponse,
} from '@bifrost/types';
import { OrderStatusEnum } from 'src/core/db/types/entities/trade-bot/orders/enums/order-status.enum';
import { IOrder } from 'src/core/db/types/entities/trade-bot/orders/order.interface';

export function fromExchangeOrderToTradeOrder(
  request: IPlaceLimitOrderRequest,
  response: IPlaceLimitOrderResponse,
): IOrder {
  return {
    ...request,
    fee: 0,
    orderId: response.orderId,
    status: OrderStatusEnum.Placed,
  };
}
