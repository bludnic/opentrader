import path from "node:path";
import { fileURLToPath } from "node:url";
import serveHandler from "serve-handler";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { Express } from "express";
import express from "express";
import cors from "cors";
import { appRouter } from "@opentrader/trpc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// created for each request
const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  const password = req.headers.authorization;

  if (password === process.env.ADMIN_PASSWORD) {
    return {
      user: {
        id: 1,
        email: "onboarding@opentrader.pro",
        displayName: "OpenTrader",
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

export const app: Express = express();

app.use(cors());
useTrpc(app);

// Serve frontend app
const staticDir = path.resolve(__dirname, "../frontend");
app.get("*", (req, res) => serveHandler(req, res, { public: staticDir }));

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
