import {
  CandlestickSeriesPartialOptions,
  ChartOptions,
  DeepPartial,
} from "lightweight-charts";

export type ChartTheme = {
  chartOptions: DeepPartial<ChartOptions>;
  candlestickSeriesOptions: CandlestickSeriesPartialOptions;
};
