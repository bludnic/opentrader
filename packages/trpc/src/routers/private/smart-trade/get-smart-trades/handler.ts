import { xprisma, toSmartTradeEntity } from "@opentrader/db";
import type { TGetSmartTradesSchema } from "./schema";
import type { Context } from "../../../../utils/context";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetSmartTradesSchema;
};

export async function getSmartTrades({ ctx, input }: Options) {
  const smartTrades = await xprisma.smartTrade.findMany({
    where: {
      owner: {
        id: ctx.user.id,
      },
      bot: {
        id: input.botId,
      },
    },
    include: {
      orders: true,
      exchangeAccount: true,
    },
  });

  return smartTrades.map((smartTrade) => toSmartTradeEntity(smartTrade));
}
