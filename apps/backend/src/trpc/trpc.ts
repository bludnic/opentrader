import { initTRPC } from '@trpc/server';
import { Context } from './utils/context';

export const trpc = initTRPC.context<Context>().create();
export const router = trpc.router;
export const mergeRouters = trpc.mergeRouters;
export const middleware = trpc.middleware;
