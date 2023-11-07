"use client";

import Box from "@mui/joy/Box";
import { FC, ReactNode } from "react";
import { APP_BAR_HEIGHT } from "./AppBar";

type AppDrawerProps = {
  children: ReactNode;
};

export const APP_DRAWER_WIDTH = 280;

export const AppDrawer: FC<AppDrawerProps> = ({ children }) => {
  return (
    <Box
      sx={(theme) => ({
        width: `${APP_DRAWER_WIDTH}px`,
        borderRightColor: theme.vars.palette.divider,
        borderRightStyle: "solid",
        borderRightWidth: 1,
        position: "fixed",
        top: `${APP_BAR_HEIGHT}px`,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
      })}
    >
      {children}
    </Box>
  );
};
