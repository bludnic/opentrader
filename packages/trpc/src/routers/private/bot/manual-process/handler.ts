import { BotProcessing } from "@opentrader/processing";
import { BotService } from "#trpc/services/bot.service";
import type { Context } from "#trpc/utils/context";
import type { TManualProcessGridBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TManualProcessGridBotInputSchema;
};

export async function manualProcessGridBot({ input }: Options) {
  const { botId } = input;

  const botService = await BotService.fromId(botId);
  botService.assertIsRunning();
  botService.assertIsNotProcessing();

  const botProcessor = new BotProcessing(botService.bot);
  await botProcessor.process();

  return {
    ok: true,
  };
}
