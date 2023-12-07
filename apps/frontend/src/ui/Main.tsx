"use client";

import { styled } from "@mui/joy/styles";
import type { FC, ReactNode } from "react";
import { APP_BAR_HEIGHT } from "./navigation/AppBar";
import { APP_DRAWER_WIDTH, APP_MINI_DRAWER_WITH } from "./navigation/AppDrawer";

export const MAIN_PADDING = 16;

export const StyledMain = styled("main")({
  padding: MAIN_PADDING,
});

type MainProps = {
  size: "sm" | "md";
  children: ReactNode;
};

export const Main: FC<MainProps> = ({ size, children }) => {
  const drawerWidth = size === "sm" ? APP_MINI_DRAWER_WITH : APP_DRAWER_WIDTH;

  return (
    <StyledMain
      sx={{
        marginLeft: `${drawerWidth}px`,
        marginTop: `${APP_BAR_HEIGHT}px`,
      }}
    >
      {children}
    </StyledMain>
  );
};
