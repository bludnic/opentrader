import {
  cancelAllOrders,
  useIndicator,
  advice,
} from "@opentrader/bot-processor";
import { logger } from "@opentrader/bot-processor";

/**
 * RSI Strategy
 */
function* RsiStrategy({ params, store }) {
  const rsiVal = yield useIndicator("RSI", params.rsi);

  if (rsiVal > params.rsi.high) {
    // new trend detected
    if (store.trend.direction !== "high") {
      this.trend = {
        duration: 0,
        persisted: false,
        direction: "high",
        adviced: false,
      };
    }

    store.trend.duration++;

    logger.debug("[RSI] In high since", storage.trend.duration, "candle(s)");

    if (store.trend.duration >= params.persistence) {
      store.trend.persisted = true;
    }

    if (this.trend.persisted && !this.trend.adviced) {
      store.trend.adviced = true;

      yield advice("short");
    }
  } else if (rsiVal < params.rsi.low) {
    // new trend detected
    if (store.trend.direction !== "low") {
      store.trend = {
        duration: 0,
        persisted: false,
        direction: "low",
        adviced: false,
      };
    }

    store.trend.direction++;

    logger.debug("[RSI] In low since", store.trend.duration, "candle(s)");

    if (store.trend.duration >= params.persistence) {
      store.trend.persisted = true;
    }

    if (store.trend.persisted && !store.trend.adviced) {
      store.trend.adviced = true;

      yield advice("long");
    }
  } else {
    logger.debug("[RSI] In no trend");
  }
}

RsiStrategy.metadata = {
  name: "RSI Strategy",
  description: "Relative Strength Index Strategy",
  tickrate: 10,
  params: {
    rsi: {
      type: "object",
      properties: {
        period: {
          type: "integer",
          default: 14,
        },
        low: {
          type: "integer",
          default: 30,
        },
        high: {
          type: "integer",
          default: 70,
        },
      },
    },
    persistence: {
      type: "integer",
      default: 3,
    },
  },
};

RsiStrategy.warmupCompleted = function* ({ candles, params }) {
  return candles.length >= params.requiredHistory;
};

RsiStrategy.start = function* ({ exchange, storage, params }) {
  const { storage } = ctx;

  yield storage.set("trend", {
    direction: "none",
    duration: 0,
    persisted: false,
    adviced: false,
  });
};

RsiStrategy.stop = function* (ctx) {
  yield cancelAllOrders();
};

RsiStrategy.log = function* ({ params, candle }) {
  const rsi = yield useIndicator("RSI", params.rsi);

  logger.debug("[RSI] Calculated RSI properties for candle:");
  logger.debug("\t", "RSI:", rsi);
  logger.debug("\t", "Price:", candle.close);
};
