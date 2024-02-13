import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/rpc";
import type { TRPCApiError } from "src/ui/errors/types";

export function isUnauthorizedError(error: TRPCApiError) {
  return (
    "code" in error.shape &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- shape is any
    error.shape.code === TRPC_ERROR_CODES_BY_KEY.UNAUTHORIZED
  );
}
