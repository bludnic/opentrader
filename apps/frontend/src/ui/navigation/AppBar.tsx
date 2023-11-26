"use client";

import type { FC, ReactNode } from "react";
import Box from "@mui/joy/Box";

type AppBarProps = {
  children: ReactNode;
};

export const APP_BAR_HEIGHT = 64;

export const AppBar: FC<AppBarProps> = ({ children }) => (
  <Box
    sx={(theme) => ({
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 1,
      gap: 2,
      backgroundColor: theme.vars.palette.background.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.vars.palette.divider,
      borderBottomStyle: "solid",
      height: APP_BAR_HEIGHT,
      zIndex: 1000,
    })}
  >
    {children}
  </Box>
);
