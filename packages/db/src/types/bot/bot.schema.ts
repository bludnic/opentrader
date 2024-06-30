import { zt } from "@opentrader/prisma";
import type { z } from "zod";
import { ZBotSettings } from "./bot-settings.schema.js";
import { ZBotState } from "./bot-state.schema.js";

export const ZBot = zt.BotSchema.extend({
  settings: ZBotSettings,
  state: ZBotState,
});

export type TBot = z.infer<typeof ZBot>;
