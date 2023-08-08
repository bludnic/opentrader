import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Breakpoint } from "@mui/material";
import { calcMiniDrawerWith } from "./helpers";
import { drawerBorderRightWidth } from "./constants";

export function calcContainerMaxWidth(
  breakpoint: Extract<Breakpoint, "xs" | "sm">
) {
  const miniDrawerWidth = calcMiniDrawerWith(breakpoint);

  return `calc(100% - ${miniDrawerWidth}px - ${drawerBorderRightWidth}px)`;
}

export const NavigationContainer = styled(Box)(({ theme }) => ({
  maxWidth: calcContainerMaxWidth("xs"),
  [theme.breakpoints.up("sm")]: {
    maxWidth: calcContainerMaxWidth("sm"),
  },
}));
