"use client";

import { useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import { FC, ReactNode } from "react";
import { APP_BAR_HEIGHT } from "./AppBar";
import { styled, type Theme } from "@mui/joy/styles";
import { CSSObject } from "@emotion/react";

type AppDrawerProps = {
  children: ReactNode;
  open: boolean;
  onChange: (open: boolean) => void;
};

export const APP_DRAWER_WIDTH = 280;
export const APP_MINI_DRAWER_WITH = 56;

const openedMixin = (theme: Theme): CSSObject => ({
  width: APP_DRAWER_WIDTH,
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${APP_MINI_DRAWER_WITH}px + 1px)`,
  },
});

export const AppDrawer: FC<AppDrawerProps> = ({ children, open, onChange }) => {
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
