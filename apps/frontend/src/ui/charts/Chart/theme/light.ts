import { LineStyle } from "lightweight-charts";
import type { ChartTheme } from "./types";

export const lightTheme: ChartTheme = {
  chartOptions: {
    layout: {
      background: { color: "#FFF" },
      textColor: "#222",
    },
    grid: {
      vertLines: { color: "#DDD" },
      horzLines: { color: "#DDD" },
    },
    timeScale: {
      timeVisible: true
    }
  },
  candlestickSeriesOptions: {
    upColor: "#26a69a",
    downColor: "#ef5350",
    borderVisible: false,
    wickUpColor: "#26a69a",
    wickDownColor: "#ef5350",

    // PriceLine options
    priceLineColor: "#000",
    priceLineWidth: 1,
    priceLineStyle: LineStyle.Dashed,
  },
};
