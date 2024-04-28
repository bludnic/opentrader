import type { SmartTradeEntity_Order_Order } from "@opentrader/db";
import { toSmartTradeEntity, xprisma } from "@opentrader/db";
import type { Context } from "#trpc/utils/context";
import type { TGetCompletedSmartTradesInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetCompletedSmartTradesInputSchema;
};

export async function getCompletedSmartTrades({ ctx, input }: Options) {
  const smartTrades = await xprisma.smartTrade.findMany({
    where: {
      type: "Trade",
      owner: {
        id: ctx.user.id,
      },
      bot: {
        id: input.botId,
      },
      orders: {
        every: {
          status: "Filled",
        },
      },
    },
    include: {
      orders: true,
      exchangeAccount: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const smartTradesDto = smartTrades.map(
    toSmartTradeEntity,
  ) as SmartTradeEntity_Order_Order[]; // more concrete type (need to add a generic prop to "toSmartTradeEntity()")

  return smartTradesDto;
}