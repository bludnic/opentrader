import { trpc, appRouter } from "@opentrader/trpc";

const ctx = {
  user: {
    id: 1,
    email: "onboarding@opentrader.pro",
    displayName: "OpenTrader",
    role: "Admin" as const,
  },
};

const createCaller = trpc.createCallerFactory(appRouter);

export const tServer = createCaller(ctx);
