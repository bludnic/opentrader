import { BotProcessing } from "@opentrader/processing";
import { BotService } from "#trpc/services/bot.service";
import type { Context } from "#trpc/utils/context";
import type { TStopGridBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TStopGridBotInputSchema;
};

export async function stopGridBot({ input }: Options) {
  const { botId } = input;

  const botService = await BotService.fromId(botId);
  botService.assertIsNotAlreadyStopped();
  botService.assertIsNotProcessing();

  const botProcessor = new BotProcessing(botService.bot);
  await botProcessor.processStopCommand();

  await botService.stop();

  return {
    ok: true,
  };
}
