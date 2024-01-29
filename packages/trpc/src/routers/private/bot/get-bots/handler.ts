import { xprisma } from "@opentrader/db";
import type { Context } from "#trpc/utils/context";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
};

export async function getBots({ ctx }: Options) {
  const bots = await xprisma.bot.custom.findMany({
    where: {
      owner: {
        id: ctx.user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bots;
}
