import { NextPage } from "next";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { coingeckoApi } from "src/lib/coingecko/apiClient";
import { CGOHLCChartPrice } from "src/lib/coingecko/types";

const OHLCCHart = dynamic(
  () => import("src/components/tradingview/OHLCChart"),
  {
    ssr: false,
  }
);

const OHLCChartNextPage: NextPage = () => {
  const [history, setHistory] = useState<CGOHLCChartPrice[]>([]);
  useEffect(() => {
    coingeckoApi.getOHLCChartHistory("bitcoin", "usd", 30).then((res) => {
      setHistory(res.data);
    });
  }, []);

  return (
    <div>
      <Typography>OHLCChart</Typography>

      {history.length > 0 ? <OHLCCHart history={history} /> : null}
    </div>
  );
};

export default OHLCChartNextPage;
