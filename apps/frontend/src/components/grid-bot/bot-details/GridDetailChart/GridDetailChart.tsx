"use client";

import Skeleton from "@mui/joy/Skeleton";
import { composeSymbolId } from "@opentrader/tools";
import { ExchangeCode } from "@opentrader/types";
import React, { FC, Suspense, useMemo, useState } from "react";
import { tClient } from "src/lib/trpc/client";
import { Chart, ChartAppBar, CHART_HEIGHT } from "src/ui/charts/Chart";
import { ExchangeAccountSelect } from "src/ui/selects/ExchangeAccountSelect";
import { SymbolSelect } from "src/ui/selects/SymbolSelect";
import { BarSizeSelect } from "src/ui/selects/BarSizeSelect";
import { TBarSize } from "src/types/literals";
import { computePriceLines } from "./utils";

const timeframes = ["1d", "4h", "1h", "5m"] as const;
export type ChartBarSize = Extract<TBarSize, (typeof timeframes)[number]>;

type GridChartProps = {
  botId: number;
};

const NOOP = () => {};

export const GridDetailChart: FC<GridChartProps> = ({ botId }) => {
  const [bot] = tClient.gridBot.getOne.useSuspenseQuery(botId);
  const [exchangeAccount] = tClient.exchangeAccount.getOne.useSuspenseQuery(
    bot.exchangeAccountId,
  );
  const [symbol] = tClient.symbol.getOne.useSuspenseQuery({
    symbolId: composeSymbolId(
      exchangeAccount.exchangeCode as ExchangeCode,
      bot.baseCurrency,
      bot.quoteCurrency,
    ),
  });
  const [smartTrades] = tClient.gridBot.activeSmartTrades.useSuspenseQuery({
    botId,
  });

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
