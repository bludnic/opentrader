import { TRPCError } from "@trpc/server";

import { XBotType } from "@opentrader/types";
import { xprisma } from "@opentrader/db";
import { dca } from "@opentrader/bot-templates";
import type { Context } from "../../../../utils/context.js";
import type { TCreateDcaBotInputSchema } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TCreateDcaBotInputSchema;
};

export async function createDcaBot({ ctx, input }: Options) {
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

  const parsed = dca.schema.safeParse(data.settings);
  if (!parsed.success) {
    throw new TRPCError({
      message: `Invalid strategy params: ${parsed.error.message}`,
      code: "PARSE_ERROR",
    });
  }

  const bot = await xprisma.bot.dca.create({
    data: {
      ...data,
      settings: JSON.stringify(data.settings),
      type: "DcaBot" satisfies XBotType,
      template: "dca",
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
