import { xprisma } from "@opentrader/db";
import type { Context } from "#trpc/utils/context";
import type { TGetBotInputSchema } from "./schema";

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
