import { xprisma } from "@opentrader/db";
import { BotService } from "../../../../services/bot.service.js";
import type { Context } from "../../../../utils/context.js";
import type { TUpdateBotInputSchema } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TUpdateBotInputSchema;
};

export async function updateBot({ ctx, input }: Options) {
  const { botId, data } = input;

  const botService = await BotService.fromId(botId);
  botService.assertIsNotAlreadyRunning();
  botService.assertIsNotProcessing();

  const bot = await xprisma.bot.custom.update({
    where: {
      id: botId,
      owner: {
        id: ctx.user.id,
      },
    },
    data: {
      ...data,
      settings: JSON.stringify(data.settings),
    },
  });

  return bot;
}
