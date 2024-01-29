import { z } from "zod";

export const ZCronPlacePendingOrdersInputSchema = z.object({
  botId: z.number().optional(),
});

export type TCronPlacePendingOrdersInputSchema = z.infer<
  typeof ZCronPlacePendingOrdersInputSchema
>;
