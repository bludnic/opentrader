import { SmartTrade } from '@bifrost/bot-processor';
import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';

/**
 * Convert `SmartTrade` iterator result into `ISmartTrade` entity
 */

export function toSmartTradeEntity(smartTrade: SmartTrade): ISmartTrade {
  const { id, buy, sell, quantity } = smartTrade;

  return {
    id,
    comment: '',
    baseCurrency: '',
    quoteCurrency: '',
    buyOrder: {
      status: buy.status,
      price: buy.price,
      createdAt: buy.createdAt,
      updatedAt: buy.updatedAt,

      exchangeOrderId: 'none',
      clientOrderId: 'none',
      side: OrderSideEnum.Buy,
      quantity,
      fee: 0,
    },
    sellOrder: sell
      ? {
          status: sell.status,
          price: sell.price,
          createdAt: sell.createdAt,
          updatedAt: sell.updatedAt,

          exchangeOrderId: 'none',
          clientOrderId: 'none',
          side: OrderSideEnum.Sell,
          quantity,
          fee: 0,
        }
      : null,
    quantity,
    botId: null,

    createdAt: 0,
    updatedAt: 0,

    userId: 'none',
    exchangeAccountId: 'none',
  };
}
