"use client";

import Box from "@mui/joy/Box";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const ChartBar: FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        mb: 1,
        gridGap: 8,
      }}
    >
      {children}
    </Box>
  );
};
