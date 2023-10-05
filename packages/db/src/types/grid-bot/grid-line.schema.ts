import { z } from "zod";

export const ZGridLineSchema = z.object({
  price: z.number(),
  quantity: z.number(),
});

export type ZGridLineSchema = z.infer<typeof ZGridLineSchema>;
