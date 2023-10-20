"use client";

import React, { FC, ReactNode, useEffect } from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import { OHLCV } from "ccxt";
import { useElementSize } from "usehooks-ts";
import { UTCTimestamp } from "lightweight-charts";

import { TBarSize } from "src/types/literals";
import { TSymbol } from "src/types/trpc";
import { CHART_HEIGHT } from "./constants";
import { useOHLC } from "./useOHLC";
import { useCandlesticksChart } from "./useCandlesticksChart";

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

type ChartProps = {
  symbol: TSymbol;
  barSize: TBarSize;
  /**
   * Chart AppBar
   */
  children?: ReactNode;
};

export const Chart: FC<ChartProps> = ({ symbol, barSize, children }) => {
  const { candlesticks, fetchPrev } = useOHLC(
    symbol.exchangeCode,
    symbol.currencyPair,
    barSize,
  );

  const chart = useCandlesticksChart({
    onScrollLeft: () => fetchPrev(),
  });
  useEffect(() => {
    chart.series.current?.setData(candlesticks.map(normalizeCandle));
  }, [candlesticks]);

  const [containerRef, { width, height }] = useElementSize();
  useEffect(() => {
    chart.api.current?.applyOptions({
      width,
      height,
    });
  }, [width, height]);

  return (
    <Card>
      {children}

      <Box
        ref={containerRef}
        sx={{
          height: CHART_HEIGHT,
        }}
      >
        <div
          ref={chart.ref}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </Card>
  );
};
