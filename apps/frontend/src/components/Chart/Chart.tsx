"use client";

import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { BarSize, ExchangeCode } from "@opentrader/types";
import React, { FC, useEffect, useState } from "react";
import { ChartAppBar } from "src/components/Chart/ChartAppBar";
import { useCandlesticksChart } from "src/components/Chart/useCandlesticksChart";
import { chartHeight } from "./constants";
import Card from "@mui/joy/Card";
import { useElementSize } from "usehooks-ts";
import CircularProgress from "@mui/joy/CircularProgress";
import Box from "@mui/joy/Box";

type ChartProps = {
  showBar?: boolean;
  exchangeCode: ExchangeCode;
};

export const Chart: FC<ChartProps> = ({ showBar }) => {
  const [exchangeCode, setExchangeCode] = useState<ExchangeCode>(
    ExchangeCode.OKX,
  );
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [barSize, setBarSize] = useState(BarSize.ONE_DAY);

  const [containerRef, { width, height }] = useElementSize();
  const { chart } = useCandlesticksChart({
    exchangeCode,
    symbol,
    barSize,
  });

  useEffect(() => {
    if (!chart.api) return console.log("Chart.api not initialized yet");

    chart.api.applyOptions({
      width: width,
      height: height,
    });
  }, [width, height]);

  return (
    <Card>
      qwe
      {showBar ? (
        <ChartAppBar>
          <Select
            value={exchangeCode}
            onChange={(e, value) => setExchangeCode(value as ExchangeCode)}
            required
          >
            <Option value={ExchangeCode.OKX}>OKx</Option>
          </Select>

          <Select
            value={symbol}
            onChange={(e, value) => setSymbol(value as string)}
            required
          >
            <Option value="BTC/USDT">BTC/USDT</Option>
            <Option value="ETH/USDT">ETH/USDT</Option>
            <Option value="UNI/USDT">UNI/USDT</Option>
          </Select>

          <Select
            value={barSize}
            onChange={(e, value) => setBarSize(value as BarSize)}
            required
          >
            <Option value={BarSize.ONE_MONTH}>1M</Option>
            <Option value={BarSize.ONE_WEEK}>1w</Option>
            <Option value={BarSize.ONE_DAY}>1d</Option>
            <Option value={BarSize.FOUR_HOURS}>4h</Option>
            <Option value={BarSize.ONE_HOUR}>1h</Option>
            <Option value={BarSize.FIFTEEN_MINUTES}>15m</Option>
            <Option value={BarSize.FIVE_MINUTES}>5m</Option>
            <Option value={BarSize.ONE_MINUTE}>5m</Option>
          </Select>
        </ChartAppBar>
      ) : null}

      {chart.loading ? <CircularProgress /> : null}

      <Box
        ref={containerRef}
        sx={{
          height: chartHeight,
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
