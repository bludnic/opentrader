import { xprisma } from "@opentrader/db";
import { SmartTradeExecutor } from "@opentrader/processing";
import type { Context } from "../../../../utils/context";
import type { TCronPlacePendingOrdersInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TCronPlacePendingOrdersInputSchema;
};

export async function cronPlacePendingOrders({ input }: Options) {
  const { botId } = input;

  const smartTrades = await xprisma.smartTrade.findMany({
    where: {
      type: "Trade",
      orders: {
        some: {
          status: "Idle",
        },
      },
      bot: {
        id: botId,
      },
    },
    include: {
      exchangeAccount: true,
      orders: true,
    },
  });

  if (smartTrades.length === 0) {
    return {
      status: "OK",
      message: "No pending SmartTrades to be placed",
    };
  }

  for (const smartTrade of smartTrades) {
    const processor = SmartTradeExecutor.create(
      smartTrade,
      smartTrade.exchangeAccount,
    );

    await processor.next();
  }

  return {
    status: "OK",
    message: "All orders were placed on the Exchange",
  };
}
