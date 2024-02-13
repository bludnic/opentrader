import type {
  IBotConfiguration,
  TBotContext,
  SmartTradeService,
} from "@opentrader/bot-processor";
import {
  cancelSmartTrade,
  createSmartTrade,
  getSmartTrade,
  useIndicators,
} from "@opentrader/bot-processor";
import type { XCandle } from "@opentrader/types";
import { OrderStatusEnum } from "@opentrader/types";

export interface LowCapBotConfig extends IBotConfiguration {
  settings: {
    targetDrop: number; // 0.05
    takeProfit: number; // 1.05
  };
}

export function* lowCap(ctx: TBotContext<LowCapBotConfig>) {
  const {
    indicators: { SMA5, SMA10, SMA15 },
    open,
    high,
    low,
    close,
  }: XCandle<"SMA5" | "SMA10" | "SMA15"> = yield useIndicators(
    ["SMA5", "SMA10", "SMA15"],
    "1h",
  );
  const { config: bot, onStart, onStop } = ctx;
  console.log("bot settings", bot);

  if (onStop) {
    yield cancelSmartTrade("x");
    console.log("[Lowcap] Bot stopped");

    return;
  }

  if (onStart) {
    console.log("[Lowcap] Bot started");
  }

  const priceDrop = (open - close) / open;

  console.log("[Lowcap] Bot process");
  console.log("OHLC", open, high, low, close);
  console.log("Price drop", `${(priceDrop * 100).toFixed(2)}%`);
  console.log("SMA5 SMA10", SMA5, SMA10);

  // cancel previous order if failed to fill at a candle close price
  const smartTrade: SmartTradeService | null = yield getSmartTrade("x");
  if (smartTrade && smartTrade.buy.status === OrderStatusEnum.Placed) {
    yield cancelSmartTrade("x");
    console.log(
      `SmartTrade cancelled buy:${smartTrade.buy.price} sell:${smartTrade.sell.price} (reason: not filled)`,
    );
  }

  // price dropped > 1%
  if (priceDrop > bot.settings.targetDrop && SMA5 < SMA10 && SMA10 < SMA15) {
    console.log(`Price dropped: ${(priceDrop * 100).toFixed(2)}%`);
    const smartTrade: SmartTradeService | null = yield getSmartTrade("x");

    if (smartTrade && !smartTrade.isCompleted()) {
      console.log(
        `There is an active SmartTrade buy:${smartTrade.buy.price} sell:${smartTrade.sell.price}. Skip placing.`,
      );
    } else {
      const smartTrade: SmartTradeService = yield createSmartTrade("x", {
        buy: {
          price: close,
        },
        sell: {
          price: close * bot.settings.takeProfit,
        },
        quantity: 1,
      });
      console.log(
        `Created SmartTrade buy:${smartTrade.buy.price} sell:${smartTrade.sell.price}.`,
      );
    }
  }
}
