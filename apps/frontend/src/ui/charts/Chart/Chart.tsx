"use client";

import type { FC, ReactNode } from "react";
import { BaseChart, type BaseChartProps } from "./BaseChart";
import { ChartBar } from "./ChartBar";
import { ChartContainer } from "./ChartContainer";

type ChartProps = BaseChartProps & {
  children: ReactNode;
};

export const Chart: FC<ChartProps> = (props) => {
  const { children, ...chartProps } = props;

  return (
    <ChartContainer>
      <ChartBar>{children}</ChartBar>

      <BaseChart
        {...chartProps}
        sx={{
          borderRadius: 6,
          overflow: "hidden",
        }}
      />
    </ChartContainer>
  );
};
