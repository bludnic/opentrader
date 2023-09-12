import { RouterOutput } from "src/lib/trpc/types";

export type TGridBot = RouterOutput["gridBot"]["getOne"];
export type TActiveSmartTrade =
  RouterOutput["gridBot"]["activeSmartTrades"][number];
export type TCompletedSmartTrade =
  RouterOutput["gridBot"]["completedSmartTrades"][number];
export type TGridBotOrder = RouterOutput["gridBot"]["orders"][number];
