import type { IBotConfiguration, TBotContext } from "@opentrader/bot-processor";
import {
  cancelSmartTrade,
  SmartTradeService,
  useExchange,
  useIndicators,
  useSmartTrade
} from "@opentrader/bot-processor";
import type { IExchange } from "@opentrader/exchanges";
import type { XCandle } from "@opentrader/types";

export interface LowCapBotConfig extends IBotConfiguration {
  settings: any;
}

export function* lowCap(ctx: TBotContext<LowCapBotConfig>) {
  const candle1m: XCandle<"SMA10" | "SMA15"> = yield useIndicators(
    ["SMA10", "SMA15"],
    "1m",
  );
  // const candle5m: XCandle<"SMA10"> = yield useIndicators(["SMA10"], "5m");
  const { config: bot, onStart, onStop } = ctx;

  if (onStop) {
    yield cancelSmartTrade("0");

    return;
  }

  const smartTrade: SmartTradeService = yield useSmartTrade("0", {
    buy: {
      price: 42000,
    },
    sell: {
      price: 50000,
    },
    quantity: 0.01,
  });

  console.log("LowCap: Bot template run.");
  console.log("smartTrade.isCompleted()", smartTrade.isCompleted());
  console.log("candle1m", candle1m);

  const exchange: IExchange = yield useExchange();
}
