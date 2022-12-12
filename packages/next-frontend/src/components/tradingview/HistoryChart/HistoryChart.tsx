import { useRef, useEffect, FC } from "react";

import { createChart, LineData } from "lightweight-charts";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { CGMarketChartPrice } from "src/lib/coingecko/client/types";

const componentName = "HistoryChart";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

type HistoryChartProps = {
  history: CGMarketChartPrice[];
  className?: string;
};

export const HistoryChart: FC<HistoryChartProps> = (props) => {
  const { className, history } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);

  const lineSeriesDate: LineData[] = history.map(([timestamp, price]) => ({
    time: new Date(timestamp).toISOString().slice(0, 10),
    value: price,
  }));

  useEffect(() => {
    if (!chartRef.current) {
      console.error(
        "Error: `chartRef.current` is `undefined`. Skip chart rendering."
      );
      return;
    }

    const chart = createChart(chartRef.current, {
      width: 800,
      height: 500,
    });
    const lineSeries = chart.addLineSeries();
    lineSeries.setData(lineSeriesDate);

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
