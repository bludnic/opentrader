import { z } from "zod";

export const ZGetBotInputSchema = z.number();

export type TGetBotInputSchema = z.infer<typeof ZGetBotInputSchema>;
