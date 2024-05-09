import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context";
import type { TUpdateBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TUpdateBotInputSchema;
};

export async function updateBot({ ctx, input }: Options) {
  const { botId, data } = input;

  const bot = await xprisma.bot.custom.update({
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
