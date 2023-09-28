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

      <SimpleChart
        lineSeriesData={[
          { time: "2019-04-11", value: 80.01 },
          { time: "2019-04-12", value: 96.63 },
          { time: "2019-04-13", value: 76.64 },
          { time: "2019-04-14", value: 81.89 },
          { time: "2019-04-15", value: 74.43 },
          { time: "2019-04-16", value: 80.01 },
          { time: "2019-04-17", value: 96.63 },
          { time: "2019-04-18", value: 76.64 },
          { time: "2019-04-19", value: 81.89 },
          { time: "2019-04-20", value: 74.43 },
        ]}
      />
    </div>
  );
};

export default SimpleChartNextPage;
