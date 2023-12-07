import Box from "@mui/joy/Box";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const ChartContainer: FC<Props> = ({ children }) => {
  return (
    <Box
      style={{
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};
