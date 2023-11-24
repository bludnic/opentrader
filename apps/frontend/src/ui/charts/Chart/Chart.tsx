"use client";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import type { OHLCV } from "ccxt";
import type {
  CreatePriceLineOptions,
  IPriceLine,
  UTCTimestamp,
} from "lightweight-charts";
import type { FC, ReactNode } from "react";
import React, { useEffect } from "react";
import { useElementSize } from "usehooks-ts";
import { tClient } from "src/lib/trpc/client";
import type { TBarSize } from "src/types/literals";
import { CHART_HEIGHT } from "./constants";
import { useCandlesticksChart } from "./useCandlesticksChart";
import { useOHLC } from "./useOHLC";

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
  symbolId: string;
  barSize: TBarSize;
  /**
   * Chart AppBar
   */
  children?: ReactNode;
  priceLines?: CreatePriceLineOptions[];
  dimmed?: boolean;
  showPriceLines?: boolean;
};

export const Chart: FC<ChartProps> = ({
  symbolId,
  barSize,
  children,
  priceLines,
  dimmed,
  showPriceLines,
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
        series.removePriceLine(priceLine);
      });
    };
  }, [priceLines, showPriceLines]);

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
          opacity: dimmed ? 0.5 : 1,
          transition: dimmed
            ? "opacity 0.1s 0.1s linear"
            : "opacity 0s 0s linear",
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
