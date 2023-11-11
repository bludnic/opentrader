"use client";

import Skeleton from "@mui/joy/Skeleton";
import React, { FC, Suspense, useMemo, useState } from "react";
import { Chart, ChartAppBar, CHART_HEIGHT } from "src/ui/charts/Chart";
import { ExchangeAccountSelect } from "src/ui/selects/ExchangeAccountSelect";
import { SymbolSelect } from "src/ui/selects/SymbolSelect";
import { BarSizeSelect } from "src/ui/selects/BarSizeSelect";
import { TBarSize } from "src/types/literals";
import { TActiveSmartTrade, TExchangeAccount, TSymbol } from "src/types/trpc";
import { computePriceLines } from "./utils";

const timeframes = ["1d", "4h", "1h", "5m"] as const;
export type ChartBarSize = Extract<TBarSize, (typeof timeframes)[number]>;

type GridChartProps = {
  exchangeAccount: TExchangeAccount;
  symbol: TSymbol;
  smartTrades: TActiveSmartTrade[];
};

const NOOP = () => {};

export const GridDetailChart: FC<GridChartProps> = ({
  exchangeAccount,
  symbol,
  smartTrades,
}) => {
  const priceLines = useMemo(
    () => computePriceLines(smartTrades),
    [smartTrades],
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
