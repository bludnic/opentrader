import { SmartTrade, SmartTradeTypeEnum } from '@bifrost/bot-processor';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';

/**
 * Convert `ISmartTrade` entity into `SmartTrade` iterator result
 * of the `@bifrost/bot-processor` package
 */

export function toSmartTradeIteratorResult(
  smartTrade: ISmartTrade,
): SmartTrade {
  const { id, buyOrder, sellOrder, quantity } = smartTrade;

  if (buyOrder && sellOrder) {
    return {
      id,
      type: SmartTradeTypeEnum.BuySell,
      quantity,
      buy: {
        status: buyOrder.status,
        price: buyOrder.price,
        createdAt: buyOrder.createdAt,
        updatedAt: buyOrder.updatedAt,
      },
      sell: {
        status: sellOrder.status,
        price: sellOrder.price,
        createdAt: sellOrder.createdAt,
        updatedAt: sellOrder.updatedAt,
      },
    };
  } else if (buyOrder) {
    return {
      id,
      type: SmartTradeTypeEnum.BuyOnly,
      quantity,
      buy: {
        status: buyOrder.status,
        price: buyOrder.price,
        createdAt: buyOrder.createdAt,
        updatedAt: buyOrder.updatedAt,
      },
      sell: null,
    };
  } else {
    return {
      id,
      type: SmartTradeTypeEnum.SellOnly,
      quantity,
      buy: null,
      sell: {
        status: sellOrder.status,
        price: sellOrder.price,
        createdAt: sellOrder.createdAt,
        updatedAt: sellOrder.updatedAt,
      },
    };
  }
}
