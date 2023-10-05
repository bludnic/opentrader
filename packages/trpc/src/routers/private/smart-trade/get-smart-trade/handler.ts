import { xprisma, toSmartTradeEntity } from "@opentrader/db";
import { Context } from "#trpc/utils/context";
import { TGetSmartTradeInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetSmartTradeInputSchema;
};

export async function getSmartTrade({ ctx, input: id }: Options) {
  const smartTrade = await xprisma.smartTrade.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      orders: true,
      exchangeAccount: true,
    },
  });

  return toSmartTradeEntity(smartTrade);
}
