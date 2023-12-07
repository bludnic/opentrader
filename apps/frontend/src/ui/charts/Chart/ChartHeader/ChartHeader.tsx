"use client";

import Sheet from "@mui/joy/Sheet";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const ChartHeader: FC<Props> = ({ children }) => {
  return (
    <Sheet
      sx={{
        position: "absolute",
        zIndex: 2, // lightweight-charts uses `zIndex: 1`
        top: 4,
        left: 4,
        borderRadius: 4,
        p: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      {children}
    </Sheet>
  );
};
