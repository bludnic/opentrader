import { appRouter } from "@opentrader/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { cache } from "@opentrader/exchanges";
import { PrismaCacheProvider } from "@opentrader/exchanges/server";
import { cookies } from "next/headers";

cache.setCacheProvider(new PrismaCacheProvider());

const FRONTEND_ENABLE_TRPC = !process.env.NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC;

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => {
      const passwordCookie = cookies().get("ADMIN_PASSWORD");

      if (!passwordCookie) {
        return {
          user: null,
        };
      }

      if (passwordCookie.value === process.env.ADMIN_PASSWORD) {
        return {
          user: {
            id: 1,
            password: "huitebe",
            email: "nu@nahui",
            displayName: "Hui tebe",
            role: "Admin" as const,
          },
        };
      }

      return {
        user: null,
      };
    },
  });

export const GET = FRONTEND_ENABLE_TRPC ? handler : undefined;
export const POST = FRONTEND_ENABLE_TRPC ? handler : undefined;

export const generateStaticParams =
  process.env.NEXT_PUBLIC_STATIC === "true"
    ? () => {
        // Workaround:
        // Next.js throws an error when building a static app and empty array is returned.
        // Error: Page "/api/trpc/[trpc]" is missing "generateStaticParams()".
        return [
          {
            trpc: "_",
          },
        ];
      }
    : undefined;

// export { handler as GET, handler as POST };
