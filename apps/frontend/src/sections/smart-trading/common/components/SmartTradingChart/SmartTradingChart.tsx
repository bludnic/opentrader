import { useRef, useEffect, FC } from "react";

import {
  createChart,
  BarData,
  UTCTimestamp,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { styled, useTheme } from "@mui/material/styles";
import clsx from "clsx";
import { ICandlestick } from "src/lib/bifrost/apiClient";
import { useElementSize } from "usehooks-ts";
import { chartMaxHeight, chartMaxWidth } from "./constants";

const componentName = "SmartTradingChart";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {
    width: "auto",
    maxWidth: "100%",
  },
}));

type SmartTradingChartProps = {
  candlesticks: ICandlestick[];
  className?: string;
};

export const SmartTradingChart: FC<SmartTradingChartProps> = (props) => {
  const { className, candlesticks } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartApi = useRef<IChartApi | null>(null);
  const lineSeriesApi = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const theme = useTheme();

  const sortedCandlesticks = [...candlesticks].sort(
    (left, right) => left.timestamp - right.timestamp,
  );

  const lineSeriesData: BarData[] = sortedCandlesticks.map(
    ({ timestamp, open, high, low, close }) => ({
      time: (new Date(timestamp).getTime() / 1000) as UTCTimestamp,
      open,
      high,
      low,
      close,
    }),
  );

  useEffect(() => {
    if (!chartRef.current) {
      console.error(
        "Error: `chartRef.current` is `undefined`. Skip chart rendering.",
      );
      return;
    }

    chartApi.current = createChart(chartRef.current, {
      width: chartMaxWidth,
      height: chartMaxHeight,
      layout: {
        background: { color: "#222" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
    });

    // Feed chart with data
    lineSeriesApi.current = chartApi.current.addCandlestickSeries();

    lineSeriesApi.current.setData(lineSeriesData);

    chartApi.current.timeScale().fitContent();

    return () => {
      if (chartApi.current) {
        chartApi.current.remove();
        chartApi.current = null;
        lineSeriesApi.current = null;
      }
    };
  }, []);

  const [containerRef, { width, height }] = useElementSize();

  useEffect(() => {
    if (!chartApi.current) {
      console.warn("ChartApi is not initialized yet");
      return;
    }

    chartApi.current.applyOptions({
      width: width < chartMaxWidth ? width : chartMaxWidth,
      height: height < chartMaxHeight ? height : chartMaxHeight,
    });
  }, [width, height]);

  return (
    <Root className={clsx(classes.root, className)} ref={containerRef}>
      <div ref={chartRef} />
    </Root>
  );
};
