import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
import { calculateSymbolOKX } from 'src/grid-bot/utils/calculateSymbolOKX';

export function calculateLimitOrdersFromDeals(
  deals: IDeal[],
  bot: IGridBot,
): IPlaceLimitOrderRequest[] {
  const orders: IPlaceLimitOrderRequest[] = [];

  deals.forEach((deal) => {
    if (deal.status === DealStatusEnum.BuyPlaced) {
      const order: IPlaceLimitOrderRequest = {
        clientOrderId: `${deal.buyOrder.clientOrderId}`,
        symbol: calculateSymbolOKX(bot.baseCurrency, bot.quoteCurrency),
        price: deal.buyOrder.price,
        quantity: deal.quantity,
        side: 'buy',
      };

      orders.push(order);
    } else if (deal.status === DealStatusEnum.SellPlaced) {
      const order: IPlaceLimitOrderRequest = {
        clientOrderId: `${deal.sellOrder.clientOrderId}`,
        symbol: calculateSymbolOKX(bot.baseCurrency, bot.quoteCurrency),
        price: deal.sellOrder.price,
        quantity: deal.quantity,
        side: 'sell',
      };

      orders.push(order);
    }
  });

  return orders;
}
