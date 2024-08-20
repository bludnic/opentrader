import type { UseSmartTradePayload } from "@opentrader/bot-processor";
import type { Prisma } from "@opentrader/db";
import { XEntityType, XOrderSide, XSmartTradeType } from "@opentrader/types";
import { toPrismaOrder } from "./toPrismaOrder.js";

/**
 * Convert `SmartTrade` iterator result into `ISmartTrade` entity
 */

type Params = {
  ref: string;
  symbol: string;

  exchangeAccountId: number;
  ownerId: number;
  botId: number;
};

export function toPrismaSmartTrade(smartTrade: UseSmartTradePayload, params: Params): Prisma.SmartTradeCreateInput {
  const { buy, sell, quantity } = smartTrade;
  const { ref, symbol, exchangeAccountId, ownerId, botId } = params;

  const buyOrderData = toPrismaOrder(buy, quantity, XOrderSide.Buy, XEntityType.EntryOrder, exchangeAccountId, symbol);

  const sellOrderData = sell
    ? toPrismaOrder(sell, quantity, XOrderSide.Sell, XEntityType.TakeProfitOrder, exchangeAccountId, symbol)
    : undefined;

  return {
    entryType: "Order",
    takeProfitType: sell ? "Order" : "None",

    ref,
    type: XSmartTradeType.Trade,
    symbol,

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
