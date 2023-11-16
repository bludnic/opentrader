import { z } from "zod";

export const ZGetGridBotFormOptionsInputSchema = z.object({
  symbolId: z.string(),
});

export type TGetGridBotFormOptionsInputSchema = z.infer<
  typeof ZGetGridBotFormOptionsInputSchema
>;
