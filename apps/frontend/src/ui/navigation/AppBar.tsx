"use client";

import { FC, ReactNode } from "react";
import Box from "@mui/joy/Box";

type AppBarProps = {
  children: ReactNode;
};

export const APP_BAR_HEIGHT = 64;

export const AppBar: FC<AppBarProps> = ({ children }) => (
  <Box
    sx={(theme) => ({
      position: "sticky",
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
    })}
  >
    {children}
  </Box>
);
