"use client";

import type { FC, ReactNode } from "react";
import Box from "@mui/joy/Box";
import { type Theme } from "@mui/joy/styles";
import type { CSSObject } from "@emotion/react";
import { APP_BAR_HEIGHT } from "./AppBar";

type AppDrawerProps = {
  children: ReactNode;
  open: boolean;
};

export const APP_DRAWER_WIDTH = 280;
export const APP_MINI_DRAWER_WITH = 56;

const openedMixin = (_theme: Theme): CSSObject => ({
  width: APP_DRAWER_WIDTH,
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${APP_MINI_DRAWER_WITH}px + 1px)`,
  },
});

export const AppDrawer: FC<AppDrawerProps> = ({ children, open }) => {
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
        flexDirection: "column",
        ...(open && {
          ...openedMixin(theme),
        }),
        ...(!open && {
          ...closedMixin(theme),
        }),

        display: "none",
        [theme.breakpoints.up("sm")]: {
          display: "flex",
        },
      })}
    >
      {children}
    </Box>
  );
};
