import { z } from "zod";

export const ZBotState = z.record(z.any());

export type TBotState = z.infer<typeof ZBotState>;
