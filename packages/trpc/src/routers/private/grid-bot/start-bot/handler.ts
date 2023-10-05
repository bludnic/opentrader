import { GridBotProcessor } from "@opentrader/processing";
import { GridBotService } from "#trpc/services/grid-bot.service";
import { Context } from "#trpc/utils/context";
import { TStartGridBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TStartGridBotInputSchema;
};

export async function startGridBot({ ctx, input }: Options) {
  const { botId } = input;

  const botService = await GridBotService.fromId(botId);
  botService.assertIsNotAlreadyRunning();
  botService.assertIsNotProcessing();

  const botProcessor = new GridBotProcessor(botService.bot);
  await botProcessor.processStartCommand();

  await botService.start();

  return {
    ok: true,
  };
}
