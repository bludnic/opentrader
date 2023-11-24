import type { TRPCClientErrorLike } from "@trpc/client";
import type { AnyProcedure, AnyRouter } from "@trpc/server";
import type { TRPCErrorShape } from "@trpc/server/dist/rpc";

export type TRPCApiError = TRPCClientErrorLike<
  AnyProcedure | AnyRouter | TRPCErrorShape<number>
>;
