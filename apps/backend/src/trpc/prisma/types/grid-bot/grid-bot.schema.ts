import { zt } from '@opentrader/prisma';
import { z } from 'zod';

import { ZGridBotSettings } from './grid-bot-settings.schema';

export const ZGridBot = zt.BotSchema.extend({
  settings: ZGridBotSettings,
});

export type TGridBot = z.infer<typeof ZGridBot>;
