import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@opentrader/backend";
//     👆 **type-only** import

const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/trpc`;

export const trpc = createTRPCProxyClient<AppRouter>({
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
