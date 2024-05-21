import { zt } from "@opentrader/prisma";
import type { z } from "zod";
import { ZGridBotSettings } from "./grid-bot-settings.schema";
import { ZBotState } from "../bot/bot-state.schema";

export const ZGridBot = zt.BotSchema.extend({
  settings: ZGridBotSettings,
  state: ZBotState,
});

export type TGridBot = z.infer<typeof ZGridBot>;
