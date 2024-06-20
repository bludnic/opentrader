import { TRPCError } from "@trpc/server";
import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context.js";
import type { TCreateGridBotInputSchema } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TCreateGridBotInputSchema;
};

export async function createGridBot({ ctx, input }: Options) {
  const { exchangeAccountId, data } = input;

  const exchangeAccount = await xprisma.exchangeAccount.findUnique({
    where: {
      id: exchangeAccountId,
      owner: {
        id: ctx.user.id,
      },
    },
  });

  if (!exchangeAccount) {
    throw new TRPCError({
      message: "Exchange Account doesn't exists",
      code: "NOT_FOUND",
    });
  }

  const bot = await xprisma.bot.grid.create({
    data: {
      ...data,
      type: "GridBot",
      template: "gridBot",
      exchangeAccount: {
        connect: {
          id: exchangeAccount.id,
        },
      },
      owner: {
        connect: {
          id: ctx.user.id,
        },
      },
    },
  });

  return bot;
}
