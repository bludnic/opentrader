import { UseSmartTradePayload } from '@bifrost/bot-processor';
import { $Enums, Prisma } from '@bifrost/prisma';
import { toPrismaOrder } from 'src/trpc/domains/grid-bot/processing/utils/order';

/**
 * Convert `SmartTrade` iterator result into `ISmartTrade` entity
 */

type Params = {
  ref: string;
  exchangeSymbolId: string;
  baseCurrency: string;
  quoteCurrency: string;

  exchangeAccountId: number;
  ownerId: number;
  botId: number;
};

export function toPrismaSmartTrade(
  smartTrade: UseSmartTradePayload,
  params: Params,
): Prisma.SmartTradeCreateInput {
  const { buy, sell, quantity } = smartTrade;
  const {
    ref,
    exchangeSymbolId,
    baseCurrency,
    quoteCurrency,
    exchangeAccountId,
    ownerId,
    botId,
  } = params;

  const buyOrderData = toPrismaOrder(
    buy,
    quantity,
    $Enums.OrderSide.Buy,
    $Enums.EntityType.EntryOrder,
  );
  const sellOrderData = toPrismaOrder(
    sell,
    quantity,
    $Enums.OrderSide.Sell,
    $Enums.EntityType.TakeProfitOrder,
  );

  return {
    entryType: 'Order',
    takeProfitType: 'Order',

    ref,
    type: $Enums.SmartTradeType.Trade,
    exchangeSymbolId,
    baseCurrency,
    quoteCurrency,

    orders: {
      createMany: {
        data: [buyOrderData, sellOrderData],
      },
    },

    exchangeAccount: {
      connect: {
        id: exchangeAccountId,
      },
    },
    owner: {
      connect: {
        id: ownerId,
      },
    },
    bot: {
      connect: {
        id: botId,
      },
    },
  };
}
