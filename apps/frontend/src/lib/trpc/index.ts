import superjson from "superjson";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@opentrader/trpc";
import { getBaseUrl } from "src/lib/trpc/getBaseUrl";
//     👆 **type-only** import

const url = `${getBaseUrl()}/api/trpc`;

// @todo remove this and use instead the client provided from `lib/trpc/client.ts` and `lib/trpc/server.ts`
export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url,
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          // authorization: getAuthCookie(),
        };
      },
    }),
  ],
});
