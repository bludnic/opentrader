import { GridBotProcessor } from "@opentrader/processing";
import { GridBotService } from "#trpc/services/grid-bot.service";
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

  const botService = await GridBotService.fromId(botId);
  botService.assertIsNotAlreadyStopped();
  botService.assertIsNotProcessing();

  const botProcessor = new GridBotProcessor(botService.bot);
  await botProcessor.processStopCommand();

  await botService.stop();

  return {
    ok: true,
  };
}
