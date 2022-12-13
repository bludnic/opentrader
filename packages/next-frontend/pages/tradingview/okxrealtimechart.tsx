import { NextPage } from "next";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { bifrostApi } from "src/lib/bifrost/apiClient";

const RealtimeChart = dynamic(
  () => import("src/components/tradingview/RealtimeChart"),
  {
    ssr: false,
  }
);

const OKXRealtimeChartNextPage: NextPage = () => {
  const [history, setHistory] = useState<any[]>([]); // @todo types
  const [lastTrade, setLastTrade] = useState<any>(); // @todo types

  useEffect(() => {
    bifrostApi.okxMarketPriceCandles().then((res) => {
      setHistory(res.data);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      bifrostApi.okxMarketTrades().then((res) => {
        setLastTrade(res.data.data[0]);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Typography>OKXRealtimeChart</Typography>

      {history.length > 0 ? (
        <RealtimeChart history={history} lastTrade={lastTrade} />
      ) : null}
    </div>
  );
};

export default OKXRealtimeChartNextPage;
