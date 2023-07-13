import { useRef, useEffect, FC } from "react";

import {
  createChart,
  LineData,
  LineStyle,
  PriceLineOptions,
  SeriesMarker,
  Time,
} from "lightweight-charts";
import { styled, useTheme } from "@mui/material/styles";
import clsx from "clsx";
import { lineSeriesFromE2EData } from "src/components/tradingview/GridSimpleChart/utils/lineSeriesFromE2EData";
import { ordersMarkersFromE2EData } from "src/components/tradingview/GridSimpleChart/utils/ordersMarkersFromE2EData";
import { gridBotE2ETestingData } from "./grid-bot-e2e-testing-data";

const componentName = "GridSimpleChart";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

type SimpleChartProps = {
  className?: string;
};

export const GridSimpleChart: FC<SimpleChartProps> = (props) => {
  const { className } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!chartRef.current) {
      console.error(
        "Error: `chartRef.current` is `undefined`. Skip chart rendering."
      );
      return;
    }

    const chart = createChart(chartRef.current, {
      width: 1800,
      height: 1000,
      timeScale: {
        barSpacing: 75,
        borderColor: "rgba(255, 255, 255, 0.8)",
      },
      layout: {
        backgroundColor: "#000",
        textColor: "rgba(255, 255, 255, 0.8)",
      },
      grid: {
        vertLines: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        horzLines: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.8)",
      },
    });

    // Set price movement data
    const lineSeriesData: LineData[] = lineSeriesFromE2EData(
      gridBotE2ETestingData
    );
    const lineSeries = chart.addLineSeries({
      color: "rgba(255, 255, 255, 0.8)",
    });
    lineSeries.setData(lineSeriesData);

    // Set start/end bot markers
    const startBotMarker: SeriesMarker<Time> = {
      time: gridBotE2ETestingData[0].time,
      position: "aboveBar",
      color: theme.palette.warning.light,
      shape: "circle",
      text: "Start Bot",
    };
    const stopBotMarker: SeriesMarker<Time> = {
      time: gridBotE2ETestingData[gridBotE2ETestingData.length - 1].time,
      position: "belowBar",
      color: theme.palette.warning.light,
      shape: "circle",
      text: "Stop Bot",
    };

    // Set deals
    const ordersMarkers: SeriesMarker<Time>[] = ordersMarkersFromE2EData(
      gridBotE2ETestingData
    );
    lineSeries.setMarkers([startBotMarker, stopBotMarker, ...ordersMarkers]);

    // Set grids
    const priceLineWidth = 1; // height of the line in px
    const gridLowerPrice = 10;
    const gridLineStepSize = 1;
    const gridLines = 11;

    Array.from({ length: gridLines }).forEach((_, i) => {
      const gridLineNumber = i + 1;
      const isUpperLimitPrice = gridLineNumber === gridLines;
      const isLowerLimitPrice = gridLineNumber === 1;
      const gridPrice = gridLowerPrice + gridLineStepSize * i;

      const priceLine: PriceLineOptions = {
        price: gridPrice,
        color: theme.palette.success.light,
        lineWidth: priceLineWidth,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: isUpperLimitPrice
          ? "Upper limit price"
          : isLowerLimitPrice
          ? "Lower limit price"
          : `${gridLineNumber}`,
      };

      lineSeries.createPriceLine(priceLine);
    });

    chart.timeScale().fitContent();

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
