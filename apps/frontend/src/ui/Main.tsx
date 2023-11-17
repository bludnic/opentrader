"use client";

import { styled } from "@mui/joy/styles";
import { FC, ReactNode } from "react";
import {
  APP_DRAWER_WIDTH,
  APP_MINI_DRAWER_WITH,
} from "src/ui/navigation/AppDrawer";

export const StyledMain = styled("main")({
  padding: 32,
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
      }}
    >
      {children}
    </StyledMain>
  );
};
