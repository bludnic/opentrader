import { xprisma } from "@opentrader/db";
import { BotService } from "../../../../services/bot.service";
import type { Context } from "../../../../utils/context";
import type { TDeleteBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TDeleteBotInputSchema;
};

export async function deleteBot({ ctx, input }: Options) {
  const { botId } = input;

  const botService = await BotService.fromId(botId);
  botService.assertIsNotAlreadyRunning();
  botService.assertIsNotProcessing();

  const deletedBot = await xprisma.bot.delete({
    where: {
      id: botId,
    },
  });

  return {
    message: "Deleted successfully",
    deletedBot,
  };
}
