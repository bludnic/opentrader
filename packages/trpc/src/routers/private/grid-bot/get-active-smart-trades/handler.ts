import type { SmartTradeEntity_Order_Order } from "@opentrader/db";
import { toSmartTradeEntity, xprisma } from "@opentrader/db";
import type { Context } from "#trpc/utils/context";
import type { TGetActiveSmartTradesInputSchema } from "./schema";

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
      ref: {
        not: null,
      },
    },
    include: {
      orders: true,
      exchangeAccount: true,
    },
  });

  const smartTradesDto = smartTrades.map(
    toSmartTradeEntity,
  ) as SmartTradeEntity_Order_Order[]; // more concrete type (need to add a generic prop to "toSmartTradeEntity()")

  return smartTradesDto.sort(
    (left, right) => right.entryOrder.price! - left.entryOrder.price!, // sort by entry price from high to low
  );
}
