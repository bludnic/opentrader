import { xprisma } from "#db/xprimsa";
import { SmartTradeProcessor } from "@opentrader/processing";
import { Context } from "#trpc/utils/context";
import { TCronPlacePendingOrdersInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TCronPlacePendingOrdersInputSchema;
};

export async function cronPlacePendingOrders({ ctx, input }: Options) {
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
    const processor = new SmartTradeProcessor(
      smartTrade,
      smartTrade.exchangeAccount,
    );

    await processor.placeNext();
  }

  return {
    status: "OK",
    message: "All orders were placed on the Exchange",
  };
}
