import type { FC } from "react";
import Box from "@mui/joy/Box";

export const Bull: FC = () => {
  return (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );
};
