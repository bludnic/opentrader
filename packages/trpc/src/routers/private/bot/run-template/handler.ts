import { BotProcessing } from "@opentrader/processing";
import { BotService } from "../../../../services/bot.service";
import type { Context } from "../../../../utils/context";
import type { TRunBotTemplateInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TRunBotTemplateInputSchema;
};

export async function runTemplate({ input }: Options) {
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
