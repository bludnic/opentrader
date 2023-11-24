import Stack from "@mui/joy/Stack";
import type { FC, ReactNode } from "react";

type ChartAppBarProps = {
  children: ReactNode;
};

export const ChartAppBar: FC<ChartAppBarProps> = ({ children }) => {
  return (
    <Stack
      alignItems="flex-start"
      direction="row"
      justifyContent="flex-start"
      spacing={2}
    >
      {children}
    </Stack>
  );
};
