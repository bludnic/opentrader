import type { UseSmartTradePayload } from "@opentrader/bot-processor";
import type { Prisma } from "@opentrader/db";
import { $Enums } from "@opentrader/db";
import { toPrismaOrder } from "./toPrismaOrder.js";

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

  const sellOrderData = sell
    ? toPrismaOrder(
        sell,
        quantity,
        $Enums.OrderSide.Sell,
        $Enums.EntityType.TakeProfitOrder,
      )
    : undefined;

  return {
    entryType: "Order",
    takeProfitType: sell ? "Order" : "None",

    ref,
    type: $Enums.SmartTradeType.Trade,
    exchangeSymbolId,
    baseCurrency,
    quoteCurrency,

    orders: {
      createMany: {
        data: sellOrderData ? [buyOrderData, sellOrderData] : [buyOrderData],
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
