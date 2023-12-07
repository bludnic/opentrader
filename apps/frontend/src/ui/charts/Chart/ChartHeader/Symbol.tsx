import type { FC } from "react";
import Box from "@mui/joy/Box";
import { fontSize } from "./constants";

type Props = {
  children: string;
};

export const Symbol: FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        lineHeight: 1,
        fontSize,
        mr: 2,
      }}
    >
      {children}
    </Box>
  );
};
