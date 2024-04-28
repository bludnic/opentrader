import { useSmartTrade, cancelAllOrders } from "@opentrader/bot-processor";
import { grid } from "@opentrader/bot-processor";

/**
 * Fixed Grid Strategy
 */
function* FixedGrid({ params, storage }) {
  const gridLevels = yield storage.get("gridLevels");

  for (const [index, grid] of gridLevels.entries()) {
    const smartTrade = yield useSmartTrade(`${index}`, {
      buy: {
        price: grid.buy.price,
        status: grid.buy.status,
      },
      sell: {
        price: grid.sell.price,
        status: grid.sell.status,
      },
      quantity: grid.buy.quantity, // or grid.sell.quantity
    });

    if (smartTrade.isCompleted()) {
      yield smartTrade.replace();
    }
  }
}

FixedGrid.warmupCompleted = function* ({ candles, params }) {
  return candles.length >= params.requiredCandles;
};

FixedGrid.start = function* ({ exchange, storage, params }) {
  const { exchange, storage, params } = ctx;

  const ticker = yield exchange.fetchTicker();

  const gridLevels = grid.fromLines(params.gridLines, ticker.last);
  yield storage.set("gridLevels", gridLevels);
};

FixedGrid.stop = function* (ctx) {
  yield cancelAllOrders();
};
