"use client";

import Skeleton from "@mui/joy/Skeleton";
import { IGridLine } from "@opentrader/types";
import React, { FC, Suspense, useDeferredValue, useMemo } from "react";
import { Chart, ChartAppBar } from "src/ui/charts/Chart";
import { CHART_HEIGHT } from "src/ui/charts/Chart/constants";
import { ExchangeAccountField } from "./form/fields/ExchangeAccountField";
import { PairField } from "./form/fields/PairField";
import { BarSizeSelect } from "src/ui/selects/BarSizeSelect";
import { InputSkeleton } from "src/ui/InputSkeleton";
import { TBarSize } from "src/types/literals";

const timeframes = ["1d", "4h", "1h", "5m"] as const;
export type ChartBarSize = Extract<TBarSize, (typeof timeframes)[number]>;

type GridChartProps = {
  symbolId: string;
  barSize: ChartBarSize;
  onBarSizeChange?: (value: ChartBarSize) => void;
  gridLines?: IGridLine[];
};

export const GridChart: FC<GridChartProps> = ({
  symbolId,
  barSize,
  onBarSizeChange,
  gridLines,
}) => {
  const deferredSymbolId = useDeferredValue(symbolId);
  const isStale = symbolId !== deferredSymbolId;

  const priceLines = useMemo(
    () => gridLines?.map((gridLine) => gridLine.price),
    [gridLines],
  );

  return (
    <Suspense
      fallback={
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height={CHART_HEIGHT}
        />
      }
    >
      <Chart
        symbolId={deferredSymbolId}
        barSize={barSize}
        priceLines={priceLines}
        dimmed={isStale}
      >
        <ChartAppBar>
          <Suspense fallback={<InputSkeleton width={232} />}>
            <ExchangeAccountField />
          </Suspense>

          <Suspense fallback={<InputSkeleton width={232} />}>
            <PairField />
          </Suspense>

          <BarSizeSelect
            value={barSize}
            onChange={(value) => {
              if (onBarSizeChange) {
                onBarSizeChange(value);
              }
            }}
            whitelist={timeframes}
          />
        </ChartAppBar>
      </Chart>
    </Suspense>
  );
};
