import { useRef, useEffect, FC } from "react";

import { createChart, BarData, UTCTimestamp } from "lightweight-charts";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { CGOHLCChartPrice } from "src/lib/coingecko/types";

const componentName = "OHLCCHart";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

type OHLCCHartProps = {
  history: CGOHLCChartPrice[];
  className?: string;
};

export const OHLCCHart: FC<OHLCCHartProps> = (props) => {
  const { className, history } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);

  const lineSeriesData: BarData[] = history.map(
    ([timestamp, open, high, low, close]) => ({
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

    const chart = createChart(chartRef.current, {
      width: 900,
      height: 500,
    });
    const lineSeries = chart.addCandlestickSeries();
    lineSeries.setData(lineSeriesData);

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
