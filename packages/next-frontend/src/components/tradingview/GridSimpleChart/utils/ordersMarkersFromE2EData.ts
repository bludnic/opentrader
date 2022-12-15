import { SeriesMarker, Time } from "lightweight-charts";
import { GridBotE2ETestingData } from "../grid-bot-e2e-testing-data";

export function ordersMarkersFromE2EData(
  e2eData: GridBotE2ETestingData[]
): SeriesMarker<Time>[] {
  const markers: SeriesMarker<Time>[] = [];

  e2eData.forEach((e2e) => {
    e2e.orders.forEach((order) => {
      if (order.side === "buy") {
        markers.push(buy(order.price, e2e.time));
      } else if (order.side === "sell") {
        markers.push(sell(order.price, e2e.time));
      }
    });
  });

  return markers;
}

function buy(price: number, time: Time): SeriesMarker<Time> {
  return {
    time,
    position: "belowBar",
    color: "#2196F3",
    shape: "arrowUp",
    text: "Buy @ " + price,
  };
}

function sell(price: number, time: Time): SeriesMarker<Time> {
  return {
    time,
    position: "aboveBar",
    color: "#e91e63",
    shape: "arrowDown",
    text: "Sell @ " + price,
  };
}
