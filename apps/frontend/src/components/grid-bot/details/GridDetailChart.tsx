"use client";

import Skeleton from "@mui/joy/Skeleton";
import { IGridLine } from "@opentrader/types";
import React, { FC, Suspense, useMemo, useState } from "react";
import { Chart, ChartAppBar } from "src/components/Chart";
import { CHART_HEIGHT } from "src/components/Chart/constants";
import { ExchangeAccountSelect } from "src/components/joy/ui/ExchangeAccountSelect";
import { SymbolSelect } from "src/components/joy/ui/SymbolSelect";
import { BarSizeSelect } from "src/components/joy/ui/BarSizeSelect";
import { TBarSize } from "src/types/literals";
import { TExchangeAccount, TSymbol } from "src/types/trpc";

const timeframes = ["1d", "4h", "1h", "5m"] as const;
export type ChartBarSize = Extract<TBarSize, (typeof timeframes)[number]>;

type GridChartProps = {
  exchangeAccount: TExchangeAccount;
  symbol: TSymbol;
  gridLines?: IGridLine[];
};

const NOOP = () => {};

export const GridDetailChart: FC<GridChartProps> = ({
  exchangeAccount,
  symbol,
  gridLines,
}) => {
  const priceLines = useMemo(
    () => gridLines?.map((gridLine) => gridLine.price),
    [gridLines],
  );

  const [barSize, setBarSize] = useState<ChartBarSize>("1h");

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
        symbolId={symbol.symbolId}
        barSize={barSize}
        priceLines={priceLines}
      >
        <ChartAppBar>
          <ExchangeAccountSelect value={exchangeAccount} onChange={NOOP} />

          <SymbolSelect
            exchangeCode={exchangeAccount.exchangeCode}
            value={symbol}
            onChange={NOOP}
          />

          <BarSizeSelect
            value={barSize}
            onChange={(value) => setBarSize(value)}
            whitelist={timeframes}
          />
        </ChartAppBar>
      </Chart>
    </Suspense>
  );
};
