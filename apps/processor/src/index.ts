import http from "node:http";
import path from "node:path";
import express from "express";
import cors from "cors";
import serveHandler from "serve-handler";
import cookieParser from "cookie-parser";
import { processor } from "./processing";
import { useTrpc } from "./trpc";

const app = express();
app.use(cookieParser());
app.use(cors());

if (process.env.NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC) {
  useTrpc(app);
}

// Serves Next.js Static generated app
if (process.env.NEXT_PUBLIC_STATIC === "true") {
  const staticDir = path.resolve(__dirname, "../../frontend/out");
  app.get("*", (req, res) => serveHandler(req, res, { public: staticDir }));
}

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

app.listen(PORT, async () => {
  console.log(`App listen on http://localhost:${PORT}`);

  await processor.onApplicationBootstrap();
});

async function shutdownCommand() {
  server.close();

  try {
    await processor.beforeApplicationShutdown();
    console.log("[ShutDown] OrderSynchronizer disabled");

    process.exit(0);
  } catch (err) {
    console.log("[ShutDown] ERROR", err);
    process.exit(1);
  }
}

let appStatus = 1;
process.on("SIGINT", () => {
  if (appStatus === 0) {
    // SIGINT is triggered twice when running the app through `pnpm run dev`.
    // Calling directly `ts-node src/index.ts` will work as expected.
    return;
  }
  appStatus = 0;

  console.log("[Terminator] SIGINT received");
  console.log("[Terminator] Gracefully shutdown. It may take some seconds...");

  void shutdownCommand();
});
