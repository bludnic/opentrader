import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./utils/context";

export const trpc = initTRPC.context<Context>().create({
  transformer: superjson,
});
export const router = trpc.router;
export const mergeRouters = trpc.mergeRouters;
export const middleware = trpc.middleware;
