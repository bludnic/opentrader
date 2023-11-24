import type { SeriesMarker, Time, UTCTimestamp } from "lightweight-charts";

export function computeMarker(
  ordersCount: number,
  time: number,
  side: "buy" | "sell",
): SeriesMarker<Time> {
  return {
    time: (new Date(time).getTime() / 1000) as UTCTimestamp,
    position: side === "buy" ? "belowBar" : "aboveBar",
    color: side === "buy" ? "#2196F3" : "#e91e63",
    shape: side === "buy" ? "arrowUp" : "arrowDown",
    text: side === "buy" ? `B #${ordersCount}` : `S #${ordersCount}`,
  };
}
