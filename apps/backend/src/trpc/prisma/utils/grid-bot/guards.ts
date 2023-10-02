import { $Enums, Bot, Prisma } from '@opentrader/prisma';
import { TGridBotSettings } from 'src/trpc/prisma/types/grid-bot/grid-bot-settings.schema';

import { TGridBot } from 'src/trpc/prisma/types/grid-bot/grid-bot.schema';
import BotType = $Enums.BotType;

export function isGridBot(bot: Bot): bot is TGridBot {
  return bot.type === 'GridBot';
}

export function assertTypeGridBot(bot: Bot): bot is TGridBot {
  if (bot.type === 'GridBot') return true;

  throw new Error('GridBot type assertion failed');
}

export function isGridBotSettings(
  type: BotType,
  settings: Prisma.JsonValue,
): settings is TGridBotSettings {
  return type === 'GridBot';
}
