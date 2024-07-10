import { trpc, appRouter } from "@opentrader/trpc";

const ctx = {
  user: {
    id: 1,
    password: "huitebe",
    email: "nu@nahui",
    displayName: "Hui tebe",
    role: "Admin" as const,
  },
};

const createCaller = trpc.createCallerFactory(appRouter);

export const tServer = createCaller(ctx);
