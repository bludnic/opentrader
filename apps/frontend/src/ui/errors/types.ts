import { TRPCClientErrorLike } from "@trpc/client";
import { AnyProcedure, AnyRouter } from "@trpc/server";
import { TRPCErrorShape } from "@trpc/server/dist/rpc";

export type TRPCApiError = TRPCClientErrorLike<
  AnyProcedure | AnyRouter | TRPCErrorShape<number>
>;
