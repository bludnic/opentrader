"use client";

import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Skeleton from "@mui/joy/Skeleton";
import { composeSymbolId } from "@opentrader/tools";
import type { ExchangeCode } from "@opentrader/types";
import type { FC } from "react";
import React, { Suspense, useMemo, useState } from "react";
import { tClient } from "src/lib/trpc/client";
import { Chart, ChartAppBar, CHART_HEIGHT } from "src/ui/charts/Chart";
import { FlexSpacer } from "src/ui/FlexSpacer";
import { ExchangeAccountSelect } from "src/ui/selects/ExchangeAccountSelect";
import { SymbolSelect } from "src/ui/selects/SymbolSelect";
import { BarSizeSelect } from "src/ui/selects/BarSizeSelect";
import type { TBarSize } from "src/types/literals";
import { computePriceLines } from "./utils";

const timeframes = ["1d", "4h", "1h", "5m"] as const;
export type ChartBarSize = Extract<TBarSize, (typeof timeframes)[number]>;

type GridChartProps = {
  botId: number;
};

const NOOP = () => void 0;

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
  const [showPriceLines, setShowPriceLines] = useState(true);

  return (
    <Suspense
      fallback={
        <Skeleton
          animation="wave"
          height={CHART_HEIGHT}
          variant="rectangular"
          width="100%"
        />
      }
    >
      <Chart
        barSize={barSize}
        priceLines={priceLines}
        showPriceLines={showPriceLines}
        symbolId={symbol.symbolId}
      >
        <ChartAppBar>
          <ExchangeAccountSelect onChange={NOOP} value={exchangeAccount} />

          <SymbolSelect
            exchangeCode={exchangeAccount.exchangeCode}
            onChange={NOOP}
            value={symbol}
          />

          <BarSizeSelect
            onChange={(value) => {
              setBarSize(value);
            }}
            value={barSize}
            whitelist={timeframes}
          />

          <FlexSpacer />

          <Box display="flex">
            <Checkbox
              checked={showPriceLines}
              label="Grid"
              onChange={(e) => setShowPriceLines(e.target.checked)}
              size="md"
            />
          </Box>
        </ChartAppBar>
      </Chart>
    </Suspense>
  );
};
