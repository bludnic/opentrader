import { IGetLimitOrderResponse } from '@bifrost/types';

export function checkOrderFilled(order: IGetLimitOrderResponse) {
  return order.status === 'filled';
}
