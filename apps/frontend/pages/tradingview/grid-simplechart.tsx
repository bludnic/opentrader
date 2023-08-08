import { NextPage } from "next";

import { Typography } from "@mui/material";
import dynamic from "next/dynamic";

const GridSimpleChart = dynamic(
  () => import("src/components/tradingview/GridSimpleChart"),
  {
    ssr: false,
  }
);

const GridSimpleChartNextPage: NextPage = () => {
  return (
    <div>
      <Typography>Данные для E2E тестирования</Typography>

      <GridSimpleChart />
    </div>
  );
};

export default GridSimpleChartNextPage;
