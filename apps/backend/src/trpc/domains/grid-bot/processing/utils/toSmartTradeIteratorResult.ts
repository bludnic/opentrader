import { SmartTrade as ProcessorSmartTrade } from '@bifrost/bot-processor';
import { toProcessorOrderStatus } from 'src/trpc/domains/grid-bot/processing/utils';
import { SmartTrade } from 'src/trpc/prisma/models/smart-trade-entity';

/**
 * Convert `ISmartTrade` entity into `SmartTrade` iterator result
 * of the `@bifrost/bot-processor` package
 */

export function toSmartTradeIteratorResult(
  smartTrade: SmartTrade,
): ProcessorSmartTrade {
  const { id } = smartTrade;

  if (!smartTrade.ref) {
    throw new Error('SmartTrade is missing ref');
  }

  if (smartTrade.type === 'DCA') {
    throw new Error(
      'toSmartTradeIteratorResult: DCA trade is not supported yet',
    );
  }

  if (smartTrade.entryType === 'Ladder') {
    throw new Error(
      'toSmartTradeIteratorResult: SmartTrade with "entryType = Ladder" is not supported yet',
    );
  }

  if (smartTrade.takeProfitType === 'Ladder') {
    throw new Error(
      'toSmartTradeIteratorResult: SmartTrade with "takeProfitType = Ladder" is not supported yet',
    );
  }

  const { entryOrder, takeProfitOrder } = smartTrade;

  if (entryOrder.type === 'Market')
    throw new Error('Order type Market is not supported yet');
  if (takeProfitOrder.type === 'Market')
    throw new Error('Order type Market is not supported yet');

  return {
    id,
    quantity: entryOrder.quantity, // or sellOrder.quantity
    ref: smartTrade.ref,
    buy: {
      status: toProcessorOrderStatus(entryOrder.status),
      price: entryOrder.price,
      createdAt: entryOrder.createdAt.getTime(),
      updatedAt: entryOrder.updatedAt.getTime(),
    },
    sell: {
      status: toProcessorOrderStatus(takeProfitOrder.status),
      price: takeProfitOrder.price,
      createdAt: takeProfitOrder.createdAt.getTime(),
      updatedAt: takeProfitOrder.updatedAt.getTime(),
    },
  };
}
