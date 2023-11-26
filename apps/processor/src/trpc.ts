import { initTRPC } from "@trpc/server";
import { appRouter } from "@opentrader/trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { Express } from "express";

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  user: {
    id: 1,
    password: "huitebe",
    email: "nu@nahui",
    displayName: "Hui tebe",
    role: "Admin" as const,
  },
});
type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();

export function useTrpc(app: Express) {
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  console.log(
    `Detected "NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC". tRPC will be served at ${process.env.NEXT_PUBLIC_PROCESSOR_URL}/api/trpc`,
  );
}
