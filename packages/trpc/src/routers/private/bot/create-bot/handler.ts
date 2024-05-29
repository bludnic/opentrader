import { BotTemplate } from "@opentrader/bot-processor";
import { findTemplate } from "@opentrader/bot-templates";
import { TRPCError } from "@trpc/server";
import { xprisma } from "@opentrader/db";
import { eventBus } from "../../../../event-bus";
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

  let strategy: BotTemplate<any>;
  try {
    strategy = findTemplate(data.template);
  } catch (err) {
    throw new TRPCError({
      message: `Strategy ${data.template} not found`,
      code: "NOT_FOUND",
    });
  }

  const parsed = strategy.schema.safeParse(data.settings);
  if (!parsed.success) {
    throw new TRPCError({
      message: `Invalid strategy params: ${parsed.error.message}`,
      code: "PARSE_ERROR",
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
  eventBus.botCreated(bot);

  return bot;
}
