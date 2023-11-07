import { xprisma } from "#db/xprimsa";
import { SmartTradeRepository } from "@opentrader/processing";
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
      botId,
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
    const smartTradeRepo = new SmartTradeRepository(
      smartTrade,
      smartTrade.exchangeAccount,
    );

    await smartTradeRepo.placeOrders();
  }

  return {
    status: "OK",
    message: "All orders were placed on the Exchange",
  };
}
