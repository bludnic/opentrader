import { xprisma } from "@opentrader/db";
import { GridBotService } from "#trpc/services/grid-bot.service";
import type { Context } from "#trpc/utils/context";
import type { TDeleteGridBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TDeleteGridBotInputSchema;
};

export async function deleteGridBot({ ctx, input }: Options) {
  const { botId } = input;

  const botService = await GridBotService.fromId(botId);
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
