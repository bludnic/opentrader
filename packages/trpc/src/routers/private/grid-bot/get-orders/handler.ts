import { xprisma } from "@opentrader/db";
import { Context } from "#trpc/utils/context";
import { TGetGridBotOrdersInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetGridBotOrdersInputSchema;
};

export async function getGridBotOrders({ ctx, input }: Options) {
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

  const orders = smartTrades
    .flatMap((smartTrade) => smartTrade.orders)
    .map((order) => {
      const { filledAt, ...rest } = order;

      if (filledAt === null)
        throw new Error(`The order ${order.id} is missing \`filledAt\``);

      return {
        ...rest,
        filledAt,
      };
    })
    .sort((leftOrder, rightOrder) => {
      return leftOrder.filledAt.getTime() - rightOrder.filledAt.getTime();
    });

  return orders;
}
