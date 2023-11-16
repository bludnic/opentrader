import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LogicalRangeChangeEventHandler,
} from "lightweight-charts";

import { useChartTheme } from "./theme/useChartTheme";

type UseCandlesticksChartParams = {
  onScrollLeft: () => void;
};

export function useCandlesticksChart(params: UseCandlesticksChartParams) {
  const { onScrollLeft } = params;

  const chartContainer = useRef<HTMLDivElement | null>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const theme = useChartTheme();

  useEffect(() => {
    chart.current = createChart(chartContainer.current!);
    series.current = chart.current.addCandlestickSeries();

    chart.current!.timeScale().fitContent();

    return () => {
      chart.current?.remove();
    };
  }, []);

  useEffect(() => {
    chart.current!.applyOptions(theme.chartOptions);
    series.current!.applyOptions(theme.candlestickSeriesOptions);
  }, [theme]);

  useEffect(() => {
    const handler: LogicalRangeChangeEventHandler = (range) => {
      if (!range) return;

      if (range.from < 0) {
        onScrollLeft();
      }
    };

    chart.current?.timeScale().subscribeVisibleLogicalRangeChange(handler);

    return () => {
      chart.current?.timeScale().unsubscribeVisibleLogicalRangeChange(handler);
    };
  }, [onScrollLeft]);

  return {
    api: chart,
    series,
    ref: chartContainer,
  };
}
