import type { SmartTradeEntity_Order_Order } from "@opentrader/db";
import { xprisma, toSmartTradeEntity } from "@opentrader/db";
import type { Context } from "../../../../utils/context";
import type { TGetSmartTradeInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetSmartTradeInputSchema;
};

export async function getSmartTrade({ input: id }: Options) {
  const smartTrade = await xprisma.smartTrade.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      orders: true,
      exchangeAccount: true,
    },
  });

  return toSmartTradeEntity(smartTrade) as SmartTradeEntity_Order_Order; // more concrete type (need to add a generic prop to "toSmartTradeEntity()")
}
