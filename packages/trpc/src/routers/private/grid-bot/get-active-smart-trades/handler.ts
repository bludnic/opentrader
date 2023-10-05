import { xprisma } from "@opentrader/db";
import { Context } from "#trpc/utils/context";
import { TGetActiveSmartTradesInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetActiveSmartTradesInputSchema;
};

export async function getActiveSmartTrades({ ctx, input }: Options) {
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
        some: {
          status: {
            in: ["Idle", "Placed"],
          },
        },
      },
      ref: {
        not: null,
      },
    },
    include: {
      orders: true,
    },
  });

  return smartTrades;
}
