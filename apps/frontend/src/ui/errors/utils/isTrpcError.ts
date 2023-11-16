import { TRPCApiError } from "src/ui/errors/types";
import { TRPCErrorSchema } from "./trpcErrorSchema";

export function isTRPCError(error: unknown): error is TRPCApiError {
  const result = TRPCErrorSchema.safeParse(error);

  return result.success;
}
