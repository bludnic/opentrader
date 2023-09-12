import { GridBotService } from 'src/trpc/domains/grid-bot/grid-bot.service';
import { Context } from 'src/trpc/utils/context';
import { TStartGridBotInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TStartGridBotInputSchema;
};

export async function startGridBot({ ctx, input }: Options) {
  const { botId } = input;

  const botService = await GridBotService.fromId(botId);

  botService.assertIsNotAlreadyRunning();
  await botService.processStartCommand();
  await botService.start();

  return {
    ok: true,
  };
}
