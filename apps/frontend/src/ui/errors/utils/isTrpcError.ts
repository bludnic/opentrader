import { TRPCErrorShape } from "@trpc/server/src/rpc/envelopes";
import { TRPCErrorSchema } from "./trpcErrorSchema";

export function isTRPCError(
  error: unknown,
): error is { shape: TRPCErrorShape } {
  const result = TRPCErrorSchema.safeParse(error);

  return result.success;
}
