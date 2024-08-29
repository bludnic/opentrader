import { findStrategy } from "@opentrader/bot-templates/server";
import { TRPCError } from "@trpc/server";
import { xprisma } from "@opentrader/db";
import { eventBus } from "@opentrader/event-bus";
import type { Context } from "../../../../utils/context.js";
import type { TCreateBotInputSchema } from "./schema.js";

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

  let strategy: ReturnType<typeof findStrategy>;
  try {
    strategy = findStrategy(data.template);
  } catch (err) {
    throw new TRPCError({
      message: `Strategy ${data.template} not found`,
      code: "NOT_FOUND",
    });
  }

  const parsed = strategy.strategyFn.schema.safeParse(data.settings);
  if (!parsed.success) {
    throw new TRPCError({
      message: `Invalid strategy params: ${parsed.error.message}`,
      code: "PARSE_ERROR",
    });
  }

  const bot = await xprisma.bot.custom.create({
    data: {
      ...data,
      settings: JSON.stringify(data.settings),
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
    include: { exchangeAccount: true },
  });
  eventBus.botCreated(bot);

  return bot;
}
