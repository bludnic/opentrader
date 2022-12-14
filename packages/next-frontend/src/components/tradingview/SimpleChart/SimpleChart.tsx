import { useRef, useEffect, FC } from "react";

import { createChart, LineData } from "lightweight-charts";
import { styled } from "@mui/material/styles";
import clsx from "clsx";

const componentName = "SimpleChart";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

type SimpleChartProps = {
  className?: string;
  lineSeriesData: LineData[];
  chartWidth?: number;
  chartHeight?: number;
};

export const SimpleChart: FC<SimpleChartProps> = (props) => {
  const {
    className,
    lineSeriesData,
    chartWidth = 400,
    chartHeight = 300,
  } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      console.error(
        "Error: `chartRef.current` is `undefined`. Skip chart rendering."
      );
      return;
    }

    const chart = createChart(chartRef.current, {
      width: chartWidth,
      height: chartHeight,
    });
    const lineSeries = chart.addLineSeries();
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
