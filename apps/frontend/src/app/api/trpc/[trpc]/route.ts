import { appRouter } from "@opentrader/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { cache } from "@opentrader/exchanges";
import { PrismaCacheProvider } from "@opentrader/exchanges/server";

cache.setCacheProvider(new PrismaCacheProvider());

export async function generateStaticParams() {
  // Workaround:
  // Next.js throws an error when building a static app and empty array is returned.
  // Error: Page "/api/trpc/[trpc]" is missing "generateStaticParams()".
  return [
    {
      trpc: "_",
    },
  ];
}

const FRONTEND_ENABLE_TRPC = !process.env.NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC;

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

export const GET = FRONTEND_ENABLE_TRPC ? handler : undefined;
export const POST = FRONTEND_ENABLE_TRPC ? handler : undefined;

// export { handler as GET, handler as POST };
