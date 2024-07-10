import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context.js";
import type { TUpdateGridBotInputSchema } from "./schema.js";

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
    data: {
      ...data,
      settings: JSON.stringify(data.settings),
    },
  });

  return bot;
}
