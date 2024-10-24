import { z } from "zod";

export const ZGetDcaBotInputSchema = z.number();

export type TGetDcaBotInputSchema = z.infer<typeof ZGetDcaBotInputSchema>;
