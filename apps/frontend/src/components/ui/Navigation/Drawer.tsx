import { styled, Theme, CSSObject, Breakpoint } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";

import { drawerWidth, drawerBorderRightWidth } from "./constants";
import { calcMiniDrawerWith } from "./helpers";

const computeWith = (breakpoint: Extract<Breakpoint, "xs" | "sm">) => {
  const width = calcMiniDrawerWith(breakpoint);

  return `calc(${width}px + ${drawerBorderRightWidth}px)`;
};

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: computeWith("xs"),
  [theme.breakpoints.up("sm")]: {
    width: computeWith("sm"),
  },
});

export const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
