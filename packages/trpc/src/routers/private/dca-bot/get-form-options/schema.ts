import { z } from "zod";

export const ZGetDcaBotFormOptionsInputSchema = z.object({
  symbolId: z.string(),
});

export type TGetDcaBotFormOptionsInputSchema = z.infer<typeof ZGetDcaBotFormOptionsInputSchema>;
