import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context.js";
import type { TGetBotInputSchema } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetBotInputSchema;
};

export async function getBot({ ctx, input: id }: Options) {
  const bot = await xprisma.bot.custom.findUniqueOrThrow({
    where: {
      id,
      owner: {
        id: ctx.user.id,
      },
    },
  });

  return bot;
}
