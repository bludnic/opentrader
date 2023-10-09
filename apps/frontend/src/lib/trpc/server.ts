import "server-only";
import { appRouter } from "@opentrader/trpc";

export const tServer = appRouter.createCaller({
  user: {
    id: 1,
    password: "huitebe",
    email: "nu@nahui.su",
    displayName: null,
    role: "Admin", // @todo remove context
  },
});
