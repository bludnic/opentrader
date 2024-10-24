import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context.js";
import type { TGetDcaBotInputSchema } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetDcaBotInputSchema;
};

export async function getDcaBot({ ctx, input: id }: Options) {
  const bot = await xprisma.bot.dca.findUniqueOrThrow({
    where: {
      id,
      owner: {
        id: ctx.user.id,
      },
    },
  });

  return bot;
}
