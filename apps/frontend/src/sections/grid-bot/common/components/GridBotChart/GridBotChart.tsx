import { IGridLine } from '@bifrost/types';
import { useRef, useEffect, FC } from "react";

import {
  createChart,
  BarData,
  UTCTimestamp,
  PriceLineOptions,
  LineStyle,
  IChartApi,
  ISeriesApi,
  SeriesMarker,
  Time,
} from "lightweight-charts";
import { styled, useTheme } from "@mui/material/styles";
import clsx from "clsx";
import { ICandlestick } from "src/lib/bifrost/apiClient";
import { useElementSize } from "usehooks-ts";
import { TradeDto } from 'src/lib/bifrost/rtkApi';

function buy(price: number, time: Time, smartTradeId: string): SeriesMarker<Time> {
  return {
    time,
    position: "belowBar",
    color: "#2196F3",
    shape: "arrowUp",
    text: "Buy @ " + price + `(${smartTradeId})`,
  };
}

function sell(price: number, time: Time, smartTradeId: string): SeriesMarker<Time> {
  return {
    time,
    position: "aboveBar",
    color: "#e91e63",
    shape: "arrowDown",
    text: "Sell @ " + price + `(${smartTradeId})`,
  };
}

function tradeToMarker(trade: TradeDto): SeriesMarker<Time> {
  const time = (new Date(trade.time).getTime() / 1000) as UTCTimestamp

  if (trade.side === 'buy') {
    return buy(trade.price, time, trade.smartTradeId)
  }

  return sell(trade.price, time, trade.smartTradeId)
}

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
  trades?: TradeDto[];
  className?: string;
};

export const GridBotChart: FC<GridBotChartProps> = (props) => {
  const { className, candlesticks, gridLines, trades = [] } = props;
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

    // Setting price lines
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
    
    // Setting trades
    const tradeMarkers: SeriesMarker<Time>[] = trades.map(tradeToMarker);
    lineSeries.setMarkers(tradeMarkers);

    return () => {
      priceLines.forEach((priceLine) => {
        lineSeriesApi.current?.removePriceLine(priceLine);
      });
    };
  }, [gridLines, trades]);

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
