import { ChartTheme } from "./types";

export const darkTheme: ChartTheme = {
  chartOptions: {
    layout: {
      background: { color: "#222" },
      textColor: "#DDD",
    },
    grid: {
      vertLines: { color: "#444" },
      horzLines: { color: "#444" },
    },
  },
  candlestickSeriesOptions: {
    upColor: "#26a69a",
    downColor: "#ef5350",
    borderVisible: false,
    wickUpColor: "#26a69a",
    wickDownColor: "#ef5350",
  },
};
