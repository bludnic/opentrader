import { initTRPC } from "@trpc/server";
import { Context } from "./utils/context";
import superjson from "superjson";

export const trpc = initTRPC.context<Context>().create({
  transformer: superjson,
});
export const router = trpc.router;
export const mergeRouters = trpc.mergeRouters;
export const middleware = trpc.middleware;
