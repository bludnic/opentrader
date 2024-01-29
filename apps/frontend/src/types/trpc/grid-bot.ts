import type { RouterInput, RouterOutput } from "src/lib/trpc/types";

export type TGridBot = RouterOutput["gridBot"]["getOne"];
export type TGridBotCreateInput = RouterInput["gridBot"]["create"];
