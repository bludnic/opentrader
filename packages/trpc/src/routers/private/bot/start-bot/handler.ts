import { BotProcessing } from "@opentrader/processing";
import { BotService } from "#trpc/services/bot.service";
import type { Context } from "#trpc/utils/context";
import type { TStartGridBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TStartGridBotInputSchema;
};

export async function startGridBot({ input }: Options) {
  const { botId } = input;

  const botService = await BotService.fromId(botId);
  botService.assertIsNotAlreadyRunning();
  botService.assertIsNotProcessing();

  const botProcessor = new BotProcessing(botService.bot);
  await botProcessor.processStartCommand();

  await botService.start();

  await botProcessor.placePendingOrders();

  return {
    ok: true,
  };
}
