"use client";

import Box from "@mui/joy/Box";
import type { SxProps } from "@mui/joy/styles/types";
import type { OHLCV } from "ccxt";
import type {
  SeriesMarker,
  Time,
  CreatePriceLineOptions,
  IPriceLine,
  UTCTimestamp,
  MouseEventHandler,
  BarData,
} from "lightweight-charts";
import type { FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { useElementSize } from "usehooks-ts";
import type { BarSize } from "@opentrader/types";
import { tClient } from "src/lib/trpc/client";
import { CHART_HEIGHT } from "./constants";
import { useCandlesticksChart } from "./useCandlesticksChart";
import { useOHLC } from "./useOHLC";
import { Ohlc, ChartHeader, Symbol } from "./ChartHeader";

function normalizeCandle(candle: OHLCV) {
  const [timestamp, open, high, low, close] = candle;

  return {
    time: (new Date(timestamp).getTime() / 1000) as UTCTimestamp,
    open,
    high,
    low,
    close,
  };
}

export type BaseChartProps = {
  symbolId: string;
  barSize: BarSize;
  priceLines?: CreatePriceLineOptions[];
  markers?: SeriesMarker<Time>[];
  showMarkers?: boolean;
  dimmed?: boolean;
  showPriceLines?: boolean;
  sx?: SxProps;
};

export const BaseChart: FC<BaseChartProps> = ({
  symbolId,
  barSize,
  priceLines,
  dimmed,
  showPriceLines,
  markers,
  showMarkers,
  sx,
}) => {
  const [symbol] = tClient.symbol.getOne.useSuspenseQuery({ symbolId });

  const { candlesticks, fetchPrev } = useOHLC(
    symbol.exchangeCode,
    symbol.currencyPair,
    barSize,
  );

  const chart = useCandlesticksChart({
    onScrollLeft: () => {
      fetchPrev();
    },
  });
  useEffect(() => {
    chart.series.current?.setData(candlesticks.map(normalizeCandle));

    const symbolChanged = candlesticks.length === 0;
    if (symbolChanged) {
      chart.api.current?.timeScale().resetTimeScale();
      chart.api.current?.priceScale("right").applyOptions({
        autoScale: true,
      });
    }
  }, [candlesticks]);

  // Price lines
  useEffect(() => {
    if (!chart.series.current || !priceLines) return;
    if (!showPriceLines) return;

    const series = chart.series.current;

    // Setting price lines
    const savedPriceLines: IPriceLine[] = priceLines.map((priceLine) =>
      series.createPriceLine(priceLine),
    );

    return () => {
      savedPriceLines.forEach((priceLine) => {
        chart.series.current?.removePriceLine(priceLine);
      });
    };
  }, [priceLines, showPriceLines]);

  // Price markers
  useEffect(() => {
    if (!chart.series.current || !markers) return;
    if (!showMarkers) return;

    const series = chart.series.current;

    series.setMarkers(markers);

    return () => {
      chart.series.current?.setMarkers([]);
    };
  }, [markers, showMarkers]);

  const [containerRef, { width, height }] = useElementSize();
  useEffect(() => {
    chart.api.current?.applyOptions({
      width,
      height,
    });
  }, [width, height]);

  // Current candle OHLC
  const [currentCandleOHLC, setCurrentCandleOHLC] = useState<BarData | null>();
  const crosshairMoveHandler = useCallback<MouseEventHandler<Time>>(
    (params) => {
      const ohlc = params.seriesData.get(chart.series.current!) as
        | BarData
        | undefined;
      setCurrentCandleOHLC(ohlc || null);
    },
    [],
  );
  useEffect(() => {
    chart.api.current?.subscribeCrosshairMove(crosshairMoveHandler);

    return () => {
      chart.api.current?.unsubscribeCrosshairMove(crosshairMoveHandler);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: CHART_HEIGHT,
        opacity: dimmed ? 0.5 : 1,
        transition: dimmed
          ? "opacity 0.1s 0.1s linear"
          : "opacity 0s 0s linear",
        position: "relative",
        ...sx,
      }}
    >
      <ChartHeader>
        <Symbol>{symbolId}</Symbol>
        {currentCandleOHLC ? <Ohlc {...currentCandleOHLC} /> : null}
      </ChartHeader>

      <div
        ref={chart.ref}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
};
