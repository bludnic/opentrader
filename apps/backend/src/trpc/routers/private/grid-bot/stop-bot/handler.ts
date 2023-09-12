import { GridBotService } from 'src/trpc/domains/grid-bot/grid-bot.service';
import { Context } from 'src/trpc/utils/context';
import { TStopGridBotInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TStopGridBotInputSchema;
};

export async function stopGridBot({ ctx, input }: Options) {
  const { botId } = input;

  const botService = await GridBotService.fromId(botId);

  botService.assertIsNotAlreadyStopped();
  await botService.processStopCommand();
  await botService.stop();

  return {
    ok: true,
  };
}
