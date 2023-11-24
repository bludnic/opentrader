import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { xprisma } from "@opentrader/db";

/**
 * Creates context for an incoming request
 * @param opts - Context options
 * {@link https://trpc.io/docs/context}
 */
export async function createContext(_opts: CreateExpressContextOptions) {
  const user = await xprisma.user.findUnique({
    where: {
      id: 1,
    },
  });

  return {
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
