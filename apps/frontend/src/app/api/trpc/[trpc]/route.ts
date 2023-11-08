import { appRouter, createContext } from "@opentrader/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { cache } from "@opentrader/exchanges";
import { PrismaCacheProvider } from "@opentrader/exchanges/server";

cache.setCacheProvider(new PrismaCacheProvider());

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      user: {
        id: 1,
        password: "huitebe",
        email: "nu@nahui",
        displayName: "Hui tebe",
        role: "Admin" as const, // @todo use createContext above
      },
    }),
  });

export { handler as GET, handler as POST };
