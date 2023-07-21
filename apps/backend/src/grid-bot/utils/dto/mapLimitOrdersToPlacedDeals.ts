import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
import { PlacedDealDto } from 'src/grid-bot/types/service/place/placed-deal.dto';

/**
 * Упрощенная версия Deals.
 * Мапит ордера которые были выставлены на биржу в момент синка.
 *
 * Используется только в JSON респонсе при синке бота.
 * Возможно пригодится для e2e тестов. Полезно для дебагинга синка.
 *
 * @param limitOrders
 */
export function mapLimitOrdersToPlacedDeals(
  limitOrders: IPlaceLimitOrderRequest[],
): PlacedDealDto[] {
  return limitOrders.map((limitOrder) => {
    const buyOrder =
      limitOrder.side === OrderSideEnum.Buy
        ? {
            status: OrderStatusEnum.Placed,
            price: limitOrder.price,
          }
        : null;

    const sellOrder =
      limitOrder.side === OrderSideEnum.Sell
        ? {
            status: OrderStatusEnum.Placed,
            price: limitOrder.price,
          }
        : null;

    return {
      buyOrder,
      sellOrder,
    };
  });
}
