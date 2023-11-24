import Big from "big.js";
import type { TCompletedSmartTrade } from "src/types/trpc";
import { computeMarker } from "src/utils/charts/marker";
import { roundToInterval } from "src/utils/date/roundToInterval";
import type { ChartBarSize } from "../GridDetailChart";

type Order = {
  smartTradeId: number;
  orderId: number;
  quantity: number;
  filledPrice: number;
  filledAt: number;
  side: "buy" | "sell";
};

type Marker = {
  timestamp: number;
  ordersCount: number;
  averagePrice: number;
  side: "buy" | "sell";
};

type MarkersMap = Record<number, Marker>;

/**
 * Creates orders buy/sell markers for `lightweight-charts`
 *
 * @param smartTrades - SmartTrades
 * @param timeframe - Timeframe
 */
export function computeTradeMarkers(
  smartTrades: TCompletedSmartTrade[],
  timeframe: ChartBarSize,
) {
  const orders = computeOrders(smartTrades);

  const buyMarkers = stackOrders(
    orders.filter((order) => order.side === "buy"),
    timeframe,
  );
  const sellMarkers = stackOrders(
    orders.filter((order) => order.side === "sell"),
    timeframe,
  );

  const markers = [...buyMarkers, ...sellMarkers].sort(
    (left, right) => left.timestamp - right.timestamp,
  );

  return markers.map((marker) =>
    computeMarker(marker.ordersCount, marker.timestamp, marker.side),
  );
}

/**
 * 1. Decompose buy/sell order of a SmartTrade
 * 2. Merge them into a flat array
 * 3. Sort by timestamp
 *
 * @param smartTrades - SmartTrades
 */
function computeOrders(smartTrades: TCompletedSmartTrade[]): Order[] {
  if (smartTrades.length === 0) {
    return [];
  }

  const orders = smartTrades
    .flatMap((smartTrade) => [
      smartTrade.entryOrder,
      smartTrade.takeProfitOrder,
    ])
    // normalize the data
    .map((order) => {
      if (order.filledPrice === null) {
        throw new Error("computeOrders: filledPrice is null");
      }

      const normalizedOrder: Order = {
        smartTradeId: order.smartTradeId,
        orderId: order.id,
        quantity: order.quantity,
        filledPrice: order.filledPrice,
        filledAt: roundToInterval(order.filledAt.getTime(), "1m"),
        side: order.side === "Buy" ? "buy" : "sell",
      };

      return normalizedOrder;
    })
    // lightweight-charts: data must be asc ordered by time
    .sort((left, right) => left.filledAt - right.filledAt);

  return orders;
}

/**
 * Stack multiple orders on same candlestick into one `Marker`.
 *
 * @param orders - Orders
 * @param timeframe - Timeframe
 */
function stackOrders(orders: Order[], timeframe: ChartBarSize): Marker[] {
  const markersMap = orders.reduce<MarkersMap>((acc, order) => {
    const timestamp = roundToInterval(order.filledAt, timeframe);
    let marker = acc[timestamp];

    if (marker) {
      marker.ordersCount += 1;
      marker.averagePrice = Number(
        Big(marker.averagePrice + order.filledPrice)
          .div(2)
          .toNumber()
          .toFixed(4),
      );
    } else {
      marker = {
        timestamp,
        ordersCount: 1,
        averagePrice: order.filledPrice,
        side: order.side,
      };
    }

    return {
      ...acc,
      [timestamp]: marker,
    };
  }, {});

  return Object.values(markersMap);
}
