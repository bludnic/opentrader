"use client";

import Skeleton from "@mui/joy/Skeleton";
import { IGridLine } from "@opentrader/types";
import React, { FC, Suspense, useDeferredValue, useMemo } from "react";
import { Chart, ChartAppBar } from "src/ui/charts/Chart";
import { CHART_HEIGHT } from "src/ui/charts/Chart/constants";
import { ExchangeAccountField } from "src/components/grid-bot/create-bot/form/fields/ExchangeAccountField";
import { PairField } from "src/components/grid-bot/create-bot/form/fields/PairField";
import { BarSizeSelect } from "src/ui/selects/BarSizeSelect";
import { InputSkeleton } from "src/ui/InputSkeleton";
import { TBarSize } from "src/types/literals";
import { computePriceLines } from "./utils";

const timeframes = ["1d", "4h", "1h", "5m"] as const;
export type ChartBarSize = Extract<TBarSize, (typeof timeframes)[number]>;

type GridChartProps = {
  symbolId: string;
  barSize: ChartBarSize;
  onBarSizeChange?: (value: ChartBarSize) => void;
  gridLines: IGridLine[];
  currentAssetPrice: number;
};

export const GridChart: FC<GridChartProps> = ({
  symbolId,
  barSize,
  onBarSizeChange,
  gridLines,
  currentAssetPrice,
}) => {
  const deferredSymbolId = useDeferredValue(symbolId);
  const isStale = symbolId !== deferredSymbolId;

  const priceLines = useMemo(
    () => computePriceLines(gridLines, currentAssetPrice),
    [gridLines, currentAssetPrice],
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
