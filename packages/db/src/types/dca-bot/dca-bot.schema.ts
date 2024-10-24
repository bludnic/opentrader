import { z } from "zod";

import { zt } from "@opentrader/prisma";
import { ZBotState } from "../bot/bot-state.schema.js";

export const ZDcaBotSettings = z.any(); // @todo use `dca.schema` from @opentrader/bot-templates

export const ZDcaBot = zt.BotSchema.extend({
  settings: ZDcaBotSettings,
  state: ZBotState,
});

export type TDcaBot = z.infer<typeof ZDcaBot>;
export type TDcaBotSettings = z.infer<typeof ZDcaBotSettings>;
