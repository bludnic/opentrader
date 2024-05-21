import { zt } from "@opentrader/prisma";
import type { z } from "zod";
import { ZBotSettings } from "./bot-settings.schema";
import { ZBotState } from "./bot-state.schema";

export const ZBot = zt.BotSchema.extend({
  settings: ZBotSettings,
  state: ZBotState,
});

export type TBot = z.infer<typeof ZBot>;
