import { IBotFirestore } from 'src/core/db/firestore/collections/bots/bot-firestore.interface';
import {
  DealStatusEnum,
  IDeal,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/okx/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
import { calculateSymbolOKX } from 'src/grid-bot/utils/calculateSymbolOKX';

export function calculateLimitOrdersFromDeals(
  deals: IDeal[],
  bot: IBotFirestore,
): IPlaceLimitOrderRequest[] {
  const orders: IPlaceLimitOrderRequest[] = [];

  deals.forEach((deal) => {
    if (deal.status === DealStatusEnum.BuyPlaced) {
      const order: IPlaceLimitOrderRequest = {
        clientOrderId: `${deal.buyOrder.id}`,
        symbol: calculateSymbolOKX(bot.baseCurrency, bot.quoteCurrency),
        price: deal.buyOrder.price,
        quantity: bot.quantityPerGrid,
        side: 'buy',
      };

      orders.push(order);
    } else if (deal.status === DealStatusEnum.SellPlaced) {
      const order: IPlaceLimitOrderRequest = {
        clientOrderId: `${deal.sellOrder.id}`,
        symbol: calculateSymbolOKX(bot.baseCurrency, bot.quoteCurrency),
        price: deal.sellOrder.price,
        quantity: bot.quantityPerGrid,
        side: 'sell',
      };

      orders.push(order);
    }
  });

  return orders;
}
