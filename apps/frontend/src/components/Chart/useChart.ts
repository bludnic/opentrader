import {
  createChart,
  IChartApi,
  ISeriesApi,
  LogicalRange,
} from "lightweight-charts";
import { RefObject, useEffect, useRef, useState } from "react";

type UseChartParams = {};

type UseChartResult =
  | {
      chartRef: RefObject<HTMLDivElement>;
      loading: true;
      chart: null;
      candlesticksSeries: null;
      logicalRange: null;
    }
  | {
      chartRef: RefObject<HTMLDivElement>;
      loading: false;
      chart: IChartApi;
      candlesticksSeries: ISeriesApi<"Candlestick">;
      logicalRange: LogicalRange | null;
    };

export function createCandlesticksChart(container: HTMLElement) {
  const chart = createChart(container, {
    layout: {
      background: { color: "#222" },
      textColor: "#DDD",
    },
    grid: {
      vertLines: { color: "#444" },
      horzLines: { color: "#444" },
    },
  });

  const candlesticks = chart.addCandlestickSeries({
    upColor: "#26a69a",
    downColor: "#ef5350",
    borderVisible: false,
    wickUpColor: "#26a69a",
    wickDownColor: "#ef5350",
  });

  return {
    chart,
    candlesticks,
  };
}

export function useChart(): UseChartResult {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartApi = useRef<IChartApi | null>(null);
  const candlesticksApi = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [logicalRange, setLogicalRange] = useState<LogicalRange | null>(null);

  const resetChart = () => {
    console.log("reset chart");
    chartApi.current?.remove();
    chartApi.current = null;
  };

  useEffect(() => {
    if (!chartRef.current) {
      return console.warn("chartRef is undefined");
    }

    if (chartApi.current) {
      return console.warn("chart already created");
    }

    const { chart, candlesticks } = createCandlesticksChart(chartRef.current);

    chartApi.current = chart;
    candlesticksApi.current = candlesticks;

    chartApi.current.timeScale().fitContent();

    setLoading(false);

    return () => resetChart();
  }, []);

  useEffect(() => {
    if (loading) {
      return console.log("Loading... onVisibleLogicalRangeChange");
    }

    if (!chartApi.current) {
      return console.warn("chartApi is undefined");
    }

    const api = chartApi.current;

    function onChange() {
      setLogicalRange(api.timeScale().getVisibleLogicalRange());
    }

    api.timeScale().subscribeVisibleLogicalRangeChange(onChange);

    return () => {
      api.timeScale().unsubscribeVisibleLogicalRangeChange(onChange);
    };
  }, [loading]);

  if (loading) {
    return {
      chartRef,
      loading,
      chart: null,
      candlesticksSeries: null,
      logicalRange: null,
    };
  }

  return {
    chartRef,
    loading,
    chart: chartApi.current as IChartApi, // @todo assert type
    candlesticksSeries: candlesticksApi.current as ISeriesApi<"Candlestick">, // @todo assert type
    logicalRange,
  };
}
