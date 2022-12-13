import { useRef, useEffect, FC } from "react";

import {
  createChart,
  BarData,
  UTCTimestamp,
  ISeriesApi,
} from "lightweight-charts";
import { styled } from "@mui/material/styles";
import clsx from "clsx";

const componentName = "RealtimeChart";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

type RealtimeChartProps = {
  history: {
    /**
     * Data generation time, Unix timestamp format in milliseconds, e.g. 1597026383085
     */
    timestamp: number;
    /**
     * String representation of `timestamp`
     */
    date: string;
    /**
     * Open price
     */
    open: number;
    /**
     * Highest price
     */
    high: number;
    /**
     * Lowest price
     */
    low: number;
    /**
     * Close price
     */
    close: number;
  }[]; // @todo types
  lastTrade?: {
    /**
     * Instrument ID
     */
    instId: string;
    /**
     * Trade ID
     */
    tradeId: string;
    /**
     * Trade price
     */
    px: string;
    /**
     * Trade quantity
     */
    sz: string;
    /**
     * Trade side (e.g. `buy`, `sell`)
     */
    side: string;
    /**
     * Trade time, Unix timestamp format in milliseconds, e.g. `1597026383085`.
     */
    ts: string;
  }; // @todo types
  className?: string;
};

export const RealtimeChart: FC<RealtimeChartProps> = (props) => {
  const { className, history, lastTrade } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<ReturnType<typeof createChart> | null>(null);
  const candlestickSeries = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const barData: BarData[] = history.map(
    ({ timestamp, open, high, low, close }) => ({
      time: (new Date(timestamp).getTime() / 1000) as UTCTimestamp,
      open,
      high,
      low,
      close,
    })
  );

  useEffect(() => {
    if (!chartRef.current) {
      console.error(
        "Error: `chartRef.current` is `undefined`. Skip chart rendering."
      );
      return;
    }

    chart.current = createChart(chartRef.current, {
      width: 800,
      height: 500,
    });
    candlestickSeries.current = chart.current.addCandlestickSeries();
    candlestickSeries.current.setData(barData);

    return () => {
      chart.current && chart.current.remove();
    };
  }, []);

  const mergeTickToBar = (lastTrade: RealtimeChartProps["lastTrade"]) => {
    if (!chart.current) {
      console.error(
        "Error: `chart.current` is `undefined`. Skip realtime update."
      );
      return;
    }
    if (!candlestickSeries.current) {
      console.error(
        "Error: `candlestickSeries.current` is `undefined`. Skip realtime update."
      );
      return;
    }

    if (!lastTrade) {
      console.error(
        "Error: `props.lastTrade` is `undefined`. Skip realtime update."
      );
      return;
    }

    candlestickSeries.current.update({
      time: barData[barData.length - 1].time,
      open: barData[barData.length - 1].open,
      high: Number(lastTrade.px),
      low: Number(lastTrade.px),
      close: Number(lastTrade.px),
    });
  };
  useEffect(() => {
    mergeTickToBar(lastTrade);
  }, [lastTrade]);

  console.log("lastTrade", lastTrade);

  return (
    <Root className={clsx(classes.root, className)}>
      <div ref={chartRef} />
    </Root>
  );
};
