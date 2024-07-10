import * as trpcExpress from "@trpc/server/adapters/express";
import type { Express } from "express";
import express from "express";
import cors from "cors";
import { appRouter } from "@opentrader/trpc";

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const password = req.headers.authorization;

  if (password === process.env.ADMIN_PASSWORD) {
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
  ``;
  return {
    user: null,
  };
};

export function useTrpc(app: Express) {
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );
}

export const app = express();
app.use(cors());
useTrpc(app);

export const createServer = () => {
  let server: ReturnType<typeof app.listen> | null = null;

  return {
    listen: (port: number, cb?: () => void) => {
      server = app.listen(port, cb);

      return server;
    },
    close: () => {
      server?.close();
    },
  };
};

// export const createClient = () => {
//   return createTRPCProxyClient<typeof appRouter>({
//     links: [
//       httpBatchLink({
//         url: "http://localhost:8000/api/trpc",
//       }),
//     ],
//   });
// };
