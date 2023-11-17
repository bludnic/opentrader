import { xprisma } from "@opentrader/db";
import { Context } from "#trpc/utils/context";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
};

export async function getGridBots({ ctx }: Options) {
  const bots = await xprisma.bot.grid.findMany({
    where: {
      owner: {
        id: ctx.user.id,
      },
    },
  });

  return bots;
}