import { NextPage } from "next";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { bifrostApi, ICandlestick, Trade } from "src/lib/bifrost/apiClient";
import backtestingResponse from 'src/lib/bifrost/backtesting-response.json'

const BacktestingChart = dynamic(
  () => import("src/components/tradingview/BacktestingChart"),
  {
    ssr: false,
  }
);

const BacktestingNextPage: NextPage = () => {
  const [history, setHistory] = useState<ICandlestick[]>([]); // @todo types
  const [trades, setTrades] = useState<Trade[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [finishedSmartTradesCount, setFinishedSmartTradesCount] = useState<number>(0);

  useEffect(() => {
    bifrostApi.backtesting().then((res) => {
      const { candles, trades, totalProfit, finishedSmartTradesCount } = res.data;

      const candlesSorted = candles.sort(
        (left, right) => left.timestamp - right.timestamp
      )
      const sortedTrades = trades.sort(
        (left, right) => left.time - right.time
      )
      
      setHistory(candlesSorted);
      setTrades(sortedTrades);
      setTotalProfit(totalProfit);
      setFinishedSmartTradesCount(finishedSmartTradesCount);
    });
  }, []);

  return (
    <div>
      <Typography>OKXCandlesHistoryChartNextPage</Typography>

      {history.length > 0 && trades.length > 0 ? (
        <BacktestingChart history={history} trades={trades} />
      ) : null}

      <div>TotalProfit: {totalProfit}</div>
      <div>Finished SmartTrades Count: {finishedSmartTradesCount}</div>
    </div>
  );
};

export default BacktestingNextPage;
