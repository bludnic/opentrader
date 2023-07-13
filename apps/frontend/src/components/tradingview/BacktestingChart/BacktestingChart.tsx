import { useRef, useEffect, FC } from "react";

import { createChart, BarData, UTCTimestamp, SeriesMarker, Time } from "lightweight-charts";
import { styled, useTheme } from "@mui/material/styles";
import clsx from "clsx";
import { ICandlestick, Trade } from "src/lib/bifrost/apiClient";

const componentName = "BacktestingChart";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

type BacktestingChartProps = {
  history: ICandlestick[];
  trades: Trade[];
  className?: string;
};

function buy(price: number, time: Time, smartTradeId: string): SeriesMarker<Time> {
  return {
    time,
    position: "inBar",
    color: "#2196F3",
    shape: "arrowUp",
    text: "Buy @ " + price + `(${smartTradeId})`,
  };
}

function sell(price: number, time: Time, smartTradeId: string): SeriesMarker<Time> {
  return {
    time,
    position: "inBar",
    color: "#e91e63",
    shape: "arrowDown",
    text: "Sell @ " + price + `(${smartTradeId})`,
  };
}

function tradeToMarker(trade: Trade): SeriesMarker<Time> {
  const time = (new Date(trade.time).getTime() / 1000) as UTCTimestamp

  if (trade.side === 'buy') {
    return buy(trade.price, time, trade.smartTradeId)
  }

  return sell(trade.price, time, trade.smartTradeId)
}

export const BacktestingChart: FC<BacktestingChartProps> = (props) => {
  const { className, history, trades } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme()

  const lineSeriesData: BarData[] = history.map(
    ({ timestamp, open, high, low, close }) => ({
      time: (new Date(timestamp).getTime() / 1000) as UTCTimestamp,
      open,
      high,
      low,
      close,
    })
  );

  const buySellMarkers: SeriesMarker<Time>[] = trades.map(tradeToMarker);

  useEffect(() => {
    if (!chartRef.current) {
      console.error(
        "Error: `chartRef.current` is `undefined`. Skip chart rendering."
      );
      return;
    }

    const chart = createChart(chartRef.current, {
      width: 900,
      height: 500,
    });
    const lineSeries = chart.addCandlestickSeries();
    lineSeries.setData(lineSeriesData);
    lineSeries.setMarkers(buySellMarkers);

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <Root className={clsx(classes.root, className)}>
      <div ref={chartRef} />
    </Root>
  );
};
