import { BotProcessing } from "@opentrader/processing";
import { eventBus } from "@opentrader/event-bus";
import { BotService } from "../../../../services/bot.service.js";
import type { Context } from "../../../../utils/context.js";
import type { TStopGridBotInputSchema } from "./schema.js";

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

  eventBus.botStopped(botId);

  return {
    ok: true,
  };
}
