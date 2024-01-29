import { zt } from "@opentrader/prisma";
import type { z } from "zod";
import { ZBotSettings } from "./bot-settings.schema";

export const ZBot = zt.BotSchema.extend({
  settings: ZBotSettings,
});

export type TBot = z.infer<typeof ZBot>;
