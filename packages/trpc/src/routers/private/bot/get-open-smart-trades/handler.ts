import type {
  SmartTradeEntity_Order_None,
  SmartTradeEntity_Order_Order,
} from "@opentrader/db";
import { toSmartTradeEntity, xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context.js";
import type { TGetOpenSmartTradesInputSchema } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetOpenSmartTradesInputSchema;
};

export async function getOpenSmartTrades({ ctx, input }: Options) {
  const smartTrades = await xprisma.smartTrade.findMany({
    where: {
      type: "Trade",
      entryType: "Order",
      takeProfitType: {
        in: ["Order", "None"],
      },
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

  const smartTradesDto = smartTrades.map(toSmartTradeEntity) as Array<
    SmartTradeEntity_Order_Order | SmartTradeEntity_Order_None
  >; // more concrete type (need to add a generic prop to "toSmartTradeEntity()")

  return smartTradesDto.sort(
    (left, right) => right.entryOrder.price! - left.entryOrder.price!, // sort by entry price from high to low
  );
}
