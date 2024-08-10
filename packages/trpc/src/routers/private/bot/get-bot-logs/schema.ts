import { z } from "zod";

export const ZGetBotLogs = z.object({
  botId: z.number(),
});

export type TGetBotLogs = z.infer<typeof ZGetBotLogs>;
