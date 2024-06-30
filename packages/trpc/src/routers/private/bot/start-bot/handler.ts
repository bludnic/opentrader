import { BotProcessing } from "@opentrader/processing";
import { eventBus } from "../../../../event-bus.js";
import { BotService } from "../../../../services/bot.service.js";
import type { Context } from "../../../../utils/context.js";
import type { TStartGridBotInputSchema } from "./schema.js";

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

  eventBus.botStarted(botId);

  return {
    ok: true,
  };
}
