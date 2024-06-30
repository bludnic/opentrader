import { initTRPC } from "@trpc/server";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { Express } from "express";
import express from "express";
import { z } from "zod";
import { logger } from "@opentrader/logger";
import { tServer } from "./trpc.js";

const t = initTRPC.create();

export const { router, procedure } = t;

const cliRouter = router({
  startBot: procedure
    .input(z.object({ botId: z.number() }))
    .mutation(async (opts) => {
      const { botId } = opts.input;

      try {
        await tServer.bot.start({ botId });
      } catch (err) {
        logger.error((err as Error).message);

        return false;
      }

      return true;
    }),
  stopBot: procedure
    .input(z.object({ botId: z.number() }))
    .mutation(async (opts) => {
      const { botId } = opts.input;

      try {
        await tServer.bot.stop({ botId });
      } catch (err) {
        logger.error((err as Error).message);

        return false;
      }

      return true;
    }),
  healthcheck: procedure.query(async () => {
    return true;
  }),
});

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

  return {
    user: null,
  };
};

export function useTrpc(app: Express) {
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: cliRouter,
      createContext,
    }),
  );
}

export const app = express();
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

export const createClient = () => {
  return createTRPCProxyClient<typeof cliRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:8000/api/trpc",
      }),
    ],
  });
};
