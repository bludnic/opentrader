import Stack from "@mui/joy/Stack";
import { FC, ReactNode } from "react";

type ChartAppBarProps = {
  children: ReactNode;
};

export const ChartAppBar: FC<ChartAppBarProps> = ({ children }) => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
    >
      {children}
    </Stack>
  );
};
