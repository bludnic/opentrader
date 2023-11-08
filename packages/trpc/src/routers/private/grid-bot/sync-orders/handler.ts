import { GridBotProcessor } from "#processing/grid-bot";
import { xprisma } from "@opentrader/db";
import { exchanges } from "@opentrader/exchanges";
import { ExchangeCode } from "@opentrader/types";
import { OrderNotFound } from "ccxt";
import { Context } from "#trpc/utils/context";
import { TSyncGridBotOrdersInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TSyncGridBotOrdersInputSchema;
};

/**
 * Sync orders statuses: exchange -> db
 * @param ctx
 * @param input
 */
export async function syncOrders({ input, ctx }: Options) {
  const { botId } = input;

  // // Find orders with `status == Placed` and the last sync was >5 minutes ago.
  // const ONE_HOUR_AGO = subMinutes(new Date(), 5);
  const orders = await xprisma.order.findMany({
    where: {
      status: "Placed",
      smartTrade: {
        botId,
      },
    },
    orderBy: {
      syncedAt: "asc",
    },
    include: {
      smartTrade: {
        include: {
          exchangeAccount: true,
        },
      },
    },
  });

  for (const order of orders) {
    if (!order.exchangeOrderId) {
      throw new Error("Order: Missing `exchangeOrderId`");
    }

    const { smartTrade } = order;
    const { exchangeAccount } = smartTrade;

    const credentials = {
      ...exchangeAccount.credentials,
      code: exchangeAccount.credentials.code as ExchangeCode, // workaround for casting string literal into `ExchangeCode`
      password: exchangeAccount.password || "",
    };
    const exchange = exchanges[exchangeAccount.exchangeCode](credentials);

    console.log(
      `Synchronize order #${order.id}: exchangeOrderId "${order.exchangeOrderId}": price: ${order.price}: status: ${order.status}`,
    );
    try {
      const exchangeOrder = await exchange.getLimitOrder({
        orderId: order.exchangeOrderId,
        symbol: smartTrade.exchangeSymbolId,
      });

      await xprisma.order.updateSyncedAt(order.id);

      if (exchangeOrder.status === "filled") {
        const statusChanged = order.status !== "Filled";
        if (statusChanged) {
          // onFilled

          await xprisma.order.updateStatusToFilled({
            orderId: order.id,
            filledPrice: exchangeOrder.filledPrice,
          });
          console.log(
            `onOrderFilled: Order #${order.id}: ${order.exchangeOrderId} was filled with price ${exchangeOrder.filledPrice}`,
          );

          const bot = await GridBotProcessor.fromSmartTradeId(
            order.smartTrade.id,
          );
          // @todo minor feature:
          // 1. Make an async queue to guarantee template execution
          // on every order filled event.
          // 2. OR cancel somehow current process, and run it again.
          await bot.process();
        }
      } else if (exchangeOrder.status === "canceled") {
        const statusChanged = order.status !== "Canceled";
        if (statusChanged) {
          // onCancelled

          // Edge case: the user may cancel the order manually on the exchange
          await xprisma.order.updateStatus("Canceled", order.id);
          console.log(
            `onOrderCanceled: Order #${order.id}: ${order.exchangeOrderId} was canceled`,
          );
        }
      }
    } catch (err) {
      if (err instanceof OrderNotFound) {
        await xprisma.order.updateStatus("Deleted", order.id);

        console.log(
          `Order not found on the exchange. Change status to "Deleted"`,
        );
      } else {
        throw err;
      }
    }
  }

  return {
    ok: true,
    orders,
  };
}
