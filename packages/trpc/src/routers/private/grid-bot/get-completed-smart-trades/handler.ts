import { xprisma } from "@opentrader/db";
import { Context } from "#trpc/utils/context";
import { TGetCompletedSmartTradesInputSchema } from "./schema";

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
    },
  });

  return smartTrades;
}
