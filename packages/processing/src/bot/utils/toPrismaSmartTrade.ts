import { CreateSmartTradePayload } from "@opentrader/bot-processor";
import type { Prisma, TBot } from "@opentrader/db";
import { XEntityType, XOrderSide } from "@opentrader/types";
import { toPrismaOrder } from "./toPrismaOrder.js";

export function toPrismaSmartTrade(
  smartTrade: CreateSmartTradePayload,
  bot: Pick<TBot, "id" | "symbol" | "exchangeAccountId" | "ownerId">,
  ref: string,
): Prisma.SmartTradeCreateInput {
  const { buy, sell, quantity } = smartTrade;

  const buyExchangeAccountId = buy.exchange || bot.exchangeAccountId;
  const buySymbol = buy.symbol || bot.symbol;
  const buyOrderData = toPrismaOrder(
    buy,
    quantity,
    XOrderSide.Buy,
    XEntityType.EntryOrder,
    buyExchangeAccountId,
    buySymbol,
  );

  const sellExchangeAccountId = sell?.exchange || bot.exchangeAccountId;
  const sellSymbol = sell?.symbol || bot.symbol;
  const sellOrderData = sell
    ? toPrismaOrder(sell, quantity, XOrderSide.Sell, XEntityType.TakeProfitOrder, sellExchangeAccountId, sellSymbol)
    : undefined;

  return {
    entryType: "Order",
    takeProfitType: sell ? "Order" : "None",

    ref,
    type: smartTrade.type,
    symbol: buySymbol,

    orders: {
      createMany: {
        data: sellOrderData ? [buyOrderData, sellOrderData] : [buyOrderData],
      },
    },

    exchangeAccount: {
      connect: {
        id: buyExchangeAccountId,
      },
    },
    owner: {
      connect: {
        id: bot.ownerId,
      },
    },
    bot: {
      connect: {
        id: bot.id,
      },
    },
  };
}
