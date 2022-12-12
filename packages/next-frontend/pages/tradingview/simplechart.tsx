import { NextPage } from "next";

import { Typography } from "@mui/material";
import dynamic from "next/dynamic";

const SimpleChart = dynamic(
  () => import("src/components/tradingview/SimpleChart"),
  {
    ssr: false,
  }
);

const SimpleChartNextPage: NextPage = () => {
  return (
    <div>
      <Typography>SimpleChart</Typography>

      <SimpleChart />
    </div>
  );
};

export default SimpleChartNextPage;
