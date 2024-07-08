import superjson from "superjson";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { appRouter } from "@opentrader/trpc";

const DAEMON_URL = "http://localhost:8000/api/trpc";

export const createClient = () => {
  return createTRPCProxyClient<typeof appRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: DAEMON_URL,
        headers: () => ({
          Authorization: process.env.ADMIN_PASSWORD,
        }),
      }),
    ],
  });
};
