"use client";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import { OHLCV } from "ccxt";
import {
  CreatePriceLineOptions,
  IPriceLine,
  LineStyle,
  UTCTimestamp,
} from "lightweight-charts";
import React, { FC, ReactNode, useEffect } from "react";
import { tClient } from "src/lib/trpc/client";

import { TBarSize } from "src/types/literals";
import { useElementSize } from "usehooks-ts";
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

/**
 * @param price
 * @param index Price line index, starting from `0` (from top to bottom)
 * @param length Total number of price lines
 */
export function priceLine(
  price: number,
  index: number,
  length: number,
): CreatePriceLineOptions {
  const lineNumber = index + 1;
  const isUpperLimitPrice = lineNumber === length;
  const isLowerLimitPrice = lineNumber === 1;

  return {
    price,
    color: "#327b32",
    axisLabelVisible: true,
    axisLabelColor: "#327b32",
    axisLabelTextColor: "#fff",
    title: isUpperLimitPrice
      ? "Upper limit price"
      : isLowerLimitPrice
      ? "Lower limit price"
      : `${index}`,
    lineVisible: true,
    lineStyle: LineStyle.Solid,
  };
}

type ChartProps = {
  symbolId: string;
  barSize: TBarSize;
  /**
   * Chart AppBar
   */
  children?: ReactNode;
  priceLines?: number[];
  dimmed?: boolean;
};

export const Chart: FC<ChartProps> = ({
  symbolId,
  barSize,
  children,
  priceLines,
  dimmed,
}) => {
  const [symbol] = tClient.symbol.getOne.useSuspenseQuery({ symbolId });

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
  useEffect(() => {
    if (!chart.series.current || !priceLines) return;

    const series = chart.series.current;

    // Setting price lines
    const savedPlaceLines: IPriceLine[] = priceLines.map((price, i) =>
      series.createPriceLine(priceLine(price, i, priceLines.length)),
    );

    return () => {
      savedPlaceLines.forEach((priceLine) => {
        series?.removePriceLine(priceLine);
      });
    };
  }, [priceLines]);

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
