import { TRPCError } from "@trpc/server";
import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context";
import type { TCreateBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TCreateBotInputSchema;
};

export async function createBot({ ctx, input }: Options) {
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

  const bot = await xprisma.bot.custom.create({
    data: {
      ...data,
      type: "Bot",
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
