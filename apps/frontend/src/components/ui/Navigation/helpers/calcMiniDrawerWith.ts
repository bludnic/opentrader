import { Breakpoint } from "@mui/material";
import { drawerBorderRightWidth, miniDrawerWithMap } from "../constants";

export function calcMiniDrawerWith(
  breakpoint: Extract<Breakpoint, "xs" | "sm">,
  includeBorderWidth?: boolean
) {
  const width = miniDrawerWithMap[breakpoint];

  if (includeBorderWidth) {
    return width + drawerBorderRightWidth;
  }

  return width;
}
