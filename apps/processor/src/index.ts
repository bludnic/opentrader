import http from "http";
import express from "express";
import { processor } from "./processing";

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send({
    hello: "world",
  });
});

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
