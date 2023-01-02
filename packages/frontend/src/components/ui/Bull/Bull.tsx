import { Box } from "@mui/material";
import { FC } from "react";

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
