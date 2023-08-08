import { Breakpoint } from "@mui/material";

export const drawerWidth = 240;

export const drawerBorderRightWidth = 1; // px

export const miniDrawerWithMap: Record<
  Extract<Breakpoint, "xs" | "sm">,
  number
> = {
  xs: 56,
  sm: 64, // and up
};
