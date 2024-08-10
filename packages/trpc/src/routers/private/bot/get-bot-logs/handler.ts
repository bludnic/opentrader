import { xprisma, TBotLog } from "@opentrader/db";
import { MarketData, StrategyAction, StrategyError, StrategyTriggerEventType } from "@opentrader/types";
import type { Context } from "../../../../utils/context.js";
import type { TGetBotLogs } from "./schema.js";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TGetBotLogs;
};

const parseJson = <T>(context: string | null | undefined) => {
  try {
    return context ? (JSON.parse(context) as T) : undefined;
  } catch (err) {
    return undefined;
  }
};

export async function getBotLogs({ input }: Options) {
  const botLogs = await xprisma.botLog.findMany({
    where: {
      bot: {
        id: input.botId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const logs: TBotLog[] = botLogs.map((log) => ({
    ...log,
    action: log.action as StrategyAction,
    triggerEventType: log.triggerEventType as StrategyTriggerEventType,
    context: parseJson<MarketData>(log.context),
    error: parseJson<StrategyError>(log.error),
  }));

  return logs;
}
