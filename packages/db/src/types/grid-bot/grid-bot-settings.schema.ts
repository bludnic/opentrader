import { z } from "zod";
import { ZGridLineSchema } from "./grid-line.schema.js";

export const ZGridBotSettings = z.object({
  gridLines: z.array(ZGridLineSchema),
});

export type TGridBotSettings = z.infer<typeof ZGridBotSettings>;
