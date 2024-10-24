import type { z } from "zod";

import { zt } from "@opentrader/prisma";
import { ZGridBotSettings } from "./grid-bot-settings.schema.js";
import { ZBotState } from "../bot/bot-state.schema.js";

export const ZGridBot = zt.BotSchema.extend({
  settings: ZGridBotSettings,
  state: ZBotState,
});

export type TGridBot = z.infer<typeof ZGridBot>;
