import { OrderSideEnum, OrderStatusEnum } from "@opentrader/types";
import { TradeService, SmartTradeService } from "./types";
import type { TBotContext } from "./types";
import type { BaseEffect, EffectType } from "./effects/types";
import type {
  buy,
  useTrade,
  sell,
  useExchange,
  useSmartTrade,
  getSmartTrade,
  cancelSmartTrade,
  createSmartTrade,
  replaceSmartTrade,
  useMarket,
  useCandle,
} from "./effects";
import {
  BUY,
  CANCEL_SMART_TRADE,
  CREATE_SMART_TRADE,
  GET_SMART_TRADE,
  REPLACE_SMART_TRADE,
  SELL,
  USE_EXCHANGE,
  USE_INDICATORS,
  USE_SMART_TRADE,
  USE_TRADE,
  USE_MARKET,
  USE_CANDLE,
} from "./effects";

export const effectRunnerMap: Record<
  EffectType,
  (effect: BaseEffect<any, any, any>, ctx: TBotContext<any>) => unknown
> = {
  [USE_SMART_TRADE]: runUseSmartTradeEffect,
  [GET_SMART_TRADE]: runGetSmartTradeEffect,
  [CANCEL_SMART_TRADE]: runCancelSmartTradeEffect,
  [CREATE_SMART_TRADE]: runCreateSmartTradeEffect,
  [REPLACE_SMART_TRADE]: runReplaceSmartTradeEffect,
  [USE_TRADE]: runUseTradeEffect,
  [BUY]: runBuyEffect,
  [SELL]: runSellEffect,
  [USE_EXCHANGE]: runUseExchangeEffect,
  [USE_INDICATORS]: () => {
    throw new Error("useIndicators() hook is deprecated");
  },
  [USE_MARKET]: runUseMarketEffect,
  [USE_CANDLE]: runUseCandleEffect,
};

async function runUseSmartTradeEffect(
  effect: ReturnType<typeof useSmartTrade>,
  ctx: TBotContext<any>,
): Promise<SmartTradeService> {
  const smartTrade = await ctx.control.getOrCreateSmartTrade(
    effect.ref,
    effect.payload,
  );

  return new SmartTradeService(effect.ref, smartTrade);
}

async function runGetSmartTradeEffect(
  effect: ReturnType<typeof getSmartTrade>,
  ctx: TBotContext<any>,
) {
  const smartTrade = await ctx.control.getSmartTrade(effect.ref);

  return smartTrade ? new SmartTradeService(effect.ref, smartTrade) : null;
}

async function runCancelSmartTradeEffect(
  effect: ReturnType<typeof cancelSmartTrade>,
  ctx: TBotContext<any>,
) {
  return ctx.control.cancelSmartTrade(effect.ref);
}

async function runCreateSmartTradeEffect(
  effect: ReturnType<typeof createSmartTrade>,
  ctx: TBotContext<any>,
) {
  const smartTrade = await ctx.control.createSmartTrade(
    effect.ref,
    effect.payload,
  );

  return new SmartTradeService(effect.ref, smartTrade);
}

async function runReplaceSmartTradeEffect(
  effect: ReturnType<typeof replaceSmartTrade>,
  ctx: TBotContext<any>,
) {
  const smartTrade = await ctx.control.replaceSmartTrade(
    effect.ref,
    effect.payload,
  );

  return new SmartTradeService(effect.ref, smartTrade);
}

async function runUseTradeEffect(
  effect: ReturnType<typeof useTrade>,
  ctx: TBotContext<any>,
) {
  const { payload, ref } = effect;

  const smartTrade = await ctx.control.getOrCreateSmartTrade(ref, {
    quantity: payload.quantity,
    buy: {
      status:
        payload.side === OrderSideEnum.Buy
          ? OrderStatusEnum.Idle
          : OrderStatusEnum.Filled,
      price: payload.price!, // @todo type
    },
    sell: {
      status: OrderStatusEnum.Idle,
      price: effect.payload.tp!, // @todo type
    },
  });

  return new SmartTradeService(effect.ref, smartTrade);
}

async function runBuyEffect(
  effect: ReturnType<typeof buy>,
  ctx: TBotContext<any>,
) {
  const { payload, ref } = effect;

  const smartTrade = await ctx.control.getOrCreateSmartTrade(ref, {
    quantity: payload.quantity,
    buy: {
      status: OrderStatusEnum.Idle,
      price: payload.price!, // @todo type
    },
  });

  return new TradeService(ref, smartTrade);
}

async function runSellEffect(
  effect: ReturnType<typeof sell>,
  ctx: TBotContext<any>,
) {
  let smartTrade = await ctx.control.getSmartTrade(effect.ref);
  if (!smartTrade) {
    console.info("Skip selling effect. Reason: Not bought before");

    return null;
  }

  if (
    smartTrade.buy.status === OrderStatusEnum.Idle ||
    smartTrade.buy.status === OrderStatusEnum.Placed
  ) {
    console.info("Skip selling effect. Reason: Buy order not filled yet");

    return null;
  }

  if (smartTrade.sell) {
    console.info("Skip selling advice. Reason: Already selling");

    return null;
  }

  smartTrade = await ctx.control.updateSmartTrade(effect.ref, {
    sell: {
      status: OrderStatusEnum.Idle,
      price: effect.payload.price!, // @todo type
    },
  });

  if (!smartTrade) {
    console.warn("Skip selling advice. Smart trade not found.");

    return null;
  }

  return new TradeService(effect.ref, smartTrade);
}

async function runUseExchangeEffect(
  effect: ReturnType<typeof useExchange>,
  ctx: TBotContext<any>,
) {
  const label = effect.payload;

  if (label) {
    console.log(`[UseExchange] Using external exchange with label: ${label}`);

    return ctx.control.getExchange(label);
  }

  return ctx.exchange;
}

async function runUseMarketEffect(
  _effect: ReturnType<typeof useMarket>,
  ctx: TBotContext<any>,
) {
  return ctx.market;
}

async function runUseCandleEffect(
  effect: ReturnType<typeof useCandle>,
  ctx: TBotContext<any>,
) {
  const index = effect.payload;

  if (index >= 0) {
    return ctx.market.candles[index];
  }

  return ctx.market.candles[ctx.market.candles.length + index];
}
