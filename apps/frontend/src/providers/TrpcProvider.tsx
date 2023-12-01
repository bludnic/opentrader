"use client";

import superjson from "superjson";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { isTRPCError } from "src/ui/errors/utils";
import { useTRPCErrorModal } from "src/ui/errors/api";
import { tClient } from "src/lib/trpc/client";
import { getBaseUrl } from "src/lib/trpc/getBaseUrl";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showErrorModal } = useTRPCErrorModal();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (isTRPCError(error)) {
              showErrorModal(error);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (isTRPCError(error)) {
              showErrorModal(error);
            }
          },
        }),
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    tClient.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <tClient.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </tClient.Provider>
  );
};
