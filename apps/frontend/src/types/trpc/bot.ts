import type { RouterInput, RouterOutput } from "src/lib/trpc/types";

export type TBot = RouterOutput["bot"]["getOne"];
export type TBotCreateInput = RouterInput["bot"]["create"];
export type TActiveSmartTrade =
  RouterOutput["bot"]["activeSmartTrades"][number];
export type TPendingSmartTrade =
  RouterOutput["bot"]["pendingSmartTrades"][number];
export type TCompletedSmartTrade =
  RouterOutput["bot"]["completedSmartTrades"][number];
export type TBotOrder = RouterOutput["bot"]["orders"][number];
