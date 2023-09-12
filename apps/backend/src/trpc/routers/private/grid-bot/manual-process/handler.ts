import { GridBotService } from 'src/trpc/domains/grid-bot/grid-bot.service';
import { Context } from 'src/trpc/utils/context';
import { TManualProcessGridBotInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TManualProcessGridBotInputSchema;
};

export async function manualProcessGridBot({ ctx, input }: Options) {
  const { botId } = input;

  const botService = await GridBotService.fromId(botId);

  botService.assertIsRunning();
  await botService.process();

  return {
    ok: true,
  };
}
