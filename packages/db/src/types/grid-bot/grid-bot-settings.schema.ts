import { z } from "zod";

import { ZGridLineSchema } from "./grid-line.schema";

export const ZGridBotSettings = z.object({
  gridLines: z.array(ZGridLineSchema),
});

export type TGridBotSettings = z.infer<typeof ZGridBotSettings>;
