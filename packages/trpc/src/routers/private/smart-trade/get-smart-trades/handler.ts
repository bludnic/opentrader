import { xprisma, toSmartTradeEntity } from "@opentrader/db";
import { Context } from "#trpc/utils/context";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
};

export async function getSmartTrades({ ctx }: Options) {
  const smartTrades = await xprisma.smartTrade.findMany({
    where: {
      owner: {
        id: ctx.user.id,
      },
    },
    include: {
      orders: true,
      exchangeAccount: true,
    },
  });

  return smartTrades.map((smartTrade) => toSmartTradeEntity(smartTrade));
}
