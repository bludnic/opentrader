import type { RouterInput, RouterOutput } from "src/lib/trpc/types";

export type TGridBot = RouterOutput["gridBot"]["getOne"];
export type TActiveSmartTrade =
  RouterOutput["gridBot"]["activeSmartTrades"][number];
export type TPendingSmartTrade =
  RouterOutput["gridBot"]["pendingSmartTrades"][number];
export type TCompletedSmartTrade =
  RouterOutput["gridBot"]["completedSmartTrades"][number];
export type TGridBotOrder = RouterOutput["gridBot"]["orders"][number];
export type TGridBotCreateInput = RouterInput["gridBot"]["create"];
