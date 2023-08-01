import { IGridLine } from '@bifrost/types';
import { useRef, useEffect, FC } from "react";

import {
  createChart,
  BarData,
  UTCTimestamp,
  ColorType,
  PriceLineOptions,
  LineStyle,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { styled, useTheme } from "@mui/material/styles";
import clsx from "clsx";
import { ICandlestick } from "src/lib/bifrost/apiClient";
import { useElementSize } from "usehooks-ts";

const componentName = "BacktestingChart";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

type GridBotChartProps = {
  candlesticks: ICandlestick[];
  gridLines: IGridLine[];
  className?: string;
};

export const GridBotChart: FC<GridBotChartProps> = (props) => {
  const { className, candlesticks, gridLines } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartApi = useRef<IChartApi | null>(null);
  const lineSeriesApi = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const theme = useTheme();

  const sortedCandlesticks = [...candlesticks].sort(
    (left, right) => left.timestamp - right.timestamp
  );

  const lineSeriesData: BarData[] = sortedCandlesticks.map(
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

    chartApi.current = createChart(chartRef.current, {
      width: 1500,
      height: 600,
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

    chartApi.current.timeScale().fitContent();

    return () => {
      if (chartApi.current) {
        chartApi.current.remove();
        chartApi.current = null;
        lineSeriesApi.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!lineSeriesApi.current) return;

    const lineSeries = lineSeriesApi.current;

    const priceLines = gridLines.map((gridLine, i) => {
      const gridLineNumber = i + 1;
      const isUpperLimitPrice = gridLineNumber === gridLines.length;
      const isLowerLimitPrice = gridLineNumber === 1;

      const priceLine: PriceLineOptions = {
        price: gridLine.price,
        color: theme.palette.success.light,
        lineWidth: 1, // height of the line in px
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: isUpperLimitPrice
          ? "Upper limit price"
          : isLowerLimitPrice
          ? "Lower limit price"
          : `${gridLineNumber}`,
        lineVisible: true,
      };

      return lineSeries.createPriceLine(priceLine);
    });

    lineSeries.setData(lineSeriesData);

    return () => {
      priceLines.forEach((priceLine) => {
        lineSeriesApi.current?.removePriceLine(priceLine);
      });
    };
  }, [gridLines]);

  const [containerRef, { width, height }] = useElementSize();

  useEffect(() => {
    chartApi.current?.applyOptions({
      width,
      height,
    });
  }, [width, height]);

  return (
    <Root className={clsx(classes.root, className)} ref={containerRef}>
      <div ref={chartRef} />
    </Root>
  );
};
