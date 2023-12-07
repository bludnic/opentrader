import Box from "@mui/joy/Box";
import type { FC, ReactNode } from "react";
import type { Color } from "./types";

type Props = {
  color: Color;
  children: ReactNode;
};

export const ColorNumber: FC<Props> = ({ color, children }) => {
  return (
    <Box
      sx={(theme) => ({
        color:
          color === "success"
            ? theme.vars.palette.success.plainColor
            : theme.vars.palette.danger.plainColor,
        display: "inline",
      })}
    >
      {children}
    </Box>
  );
};
