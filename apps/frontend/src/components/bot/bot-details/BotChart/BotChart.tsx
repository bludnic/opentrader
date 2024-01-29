"use client";

import Skeleton from "@mui/joy/Skeleton";
import { composeSymbolId } from "@opentrader/tools";
import type { FC } from "react";
import React, { Suspense, useState } from "react";
import type { BarSize } from "@opentrader/types";
import { tClient } from "src/lib/trpc/client";
import { Chart, CHART_HEIGHT } from "src/ui/charts/Chart";
import { FlexSpacer } from "src/ui/FlexSpacer";
import { ExchangeAccountSelect } from "src/ui/selects/ExchangeAccountSelect";
import { SymbolSelect } from "src/ui/selects/SymbolSelect";
import { BarSizeSelect } from "src/ui/selects/BarSizeSelect";

const timeframes = ["1d", "4h", "1h", "5m", "1m"] as const;
export type ChartBarSize = Extract<BarSize, (typeof timeframes)[number]>;

type BotChartProps = {
  botId: number;
};

const NOOP = () => void 0;

export const BotChart: FC<BotChartProps> = ({ botId }) => {
  const [bot] = tClient.bot.getOne.useSuspenseQuery(botId);
  const [exchangeAccount] = tClient.exchangeAccount.getOne.useSuspenseQuery(
    bot.exchangeAccountId,
  );
  const [symbol] = tClient.symbol.getOne.useSuspenseQuery({
    symbolId: composeSymbolId(
      exchangeAccount.exchangeCode,
      bot.baseCurrency,
      bot.quoteCurrency,
    ),
  });

  const [barSize, setBarSize] = useState<ChartBarSize>("1h");

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
      <Chart barSize={barSize} symbolId={symbol.symbolId}>
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
      </Chart>
    </Suspense>
  );
};
