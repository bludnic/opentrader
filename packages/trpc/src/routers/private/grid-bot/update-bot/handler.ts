import { xprisma } from "@opentrader/db";
import { Context } from "#trpc/utils/context";
import { TUpdateGridBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TUpdateGridBotInputSchema;
};

export async function updateGridBot({ ctx, input }: Options) {
  const { botId, data } = input;

  const bot = await xprisma.bot.grid.update({
    where: {
      id: botId,
      owner: {
        id: ctx.user.id,
      },
    },
    data,
  });

  return bot;
}
