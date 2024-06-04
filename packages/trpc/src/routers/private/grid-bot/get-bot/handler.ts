import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context";
import type { TGetGridBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetGridBotInputSchema;
};

export async function getGridBot({ ctx, input: id }: Options) {
  const bot = await xprisma.bot.grid.findUniqueOrThrow({
    where: {
      id,
      owner: {
        id: ctx.user.id,
      },
    },
  });

  return bot;
}
