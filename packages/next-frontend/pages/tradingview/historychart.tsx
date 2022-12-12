import { NextPage } from "next";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { coingeckoApi } from "src/lib/coingecko/apiClient";
import { CGMarketChartPrice } from "src/lib/coingecko/client/types";

const HistoryChart = dynamic(
  () => import("src/components/tradingview/HistoryChart"),
  {
    ssr: false,
  }
);

const HistoryChartNextPage: NextPage = () => {
  const [history, setHistory] = useState<CGMarketChartPrice[]>([]);
  useEffect(() => {
    coingeckoApi.getMarketChartHistory("bitcoin", "usd", "30").then((res) => {
      setHistory(res.data.prices);
    });
  }, []);

  return (
    <div>
      <Typography>HistoryChart</Typography>

      {history.length > 0 ? <HistoryChart history={history} /> : null}
    </div>
  );
};

export default HistoryChartNextPage;
