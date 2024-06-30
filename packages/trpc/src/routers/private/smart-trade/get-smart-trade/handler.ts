import type {
  SmartTradeEntity_Order_None,
  SmartTradeEntity_Order_Order,
} from "@opentrader/db";
import { xprisma, toSmartTradeEntity } from "@opentrader/db";
import type { Context } from "../../../../utils/context.js";
import type { TGetSmartTradeInputSchema } from "./schema.js";

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

  return toSmartTradeEntity(smartTrade) as
    | SmartTradeEntity_Order_Order
    | SmartTradeEntity_Order_None; // more concrete type (need to add a generic prop to "toSmartTradeEntity()")
}
