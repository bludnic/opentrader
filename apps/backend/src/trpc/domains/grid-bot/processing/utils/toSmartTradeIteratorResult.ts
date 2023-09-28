import { SmartTrade } from '@bifrost/bot-processor';
import { toProcessorOrderStatus } from 'src/trpc/domains/grid-bot/processing/utils';
import { SmartTradeWithOrders } from 'src/trpc/prisma/types/smart-trade/smart-trade-with-orders';

/**
 * Convert `ISmartTrade` entity into `SmartTrade` iterator result
 * of the `@bifrost/bot-processor` package
 */

export function toSmartTradeIteratorResult(
  smartTrade: SmartTradeWithOrders,
): SmartTrade {
  const { id, orders } = smartTrade;

  if (orders.length !== 2) {
    throw new Error('SmartTrade must contain one Buy and one Sell order');
  }

  const buyOrder = orders.find((order) => order.side === 'Buy');
  const sellOrder = orders.find((order) => order.side === 'Sell');

  if (!buyOrder) {
    throw new Error('Buy order not found');
  }

  if (!sellOrder) {
    throw new Error('Sell order not found');
  }

  if (!smartTrade.ref) {
    throw new Error('SmartTrade is missing ref');
  }

  return {
    id,
    quantity: buyOrder.quantity, // or sellOrder.quantity
    ref: smartTrade.ref,
    buy: {
      status: toProcessorOrderStatus(buyOrder.status),
      price: buyOrder.price,
      createdAt: buyOrder.createdAt.getTime(),
      updatedAt: buyOrder.updatedAt.getTime(),
    },
    sell: {
      status: toProcessorOrderStatus(sellOrder.status),
      price: sellOrder.price,
      createdAt: sellOrder.createdAt.getTime(),
      updatedAt: sellOrder.updatedAt.getTime(),
    },
  };
}
