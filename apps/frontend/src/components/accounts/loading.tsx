"use client";

import Box from "@mui/joy/Box";
import Skeleton from "@mui/joy/Skeleton";

export default function Loading() {
  return (
    <Box
      sx={{
        maxWidth: "1200px",
      }}
    >
      <Skeleton
        animation="wave"
        height={280}
        style={{
          borderRadius: 6,
        }}
        variant="rectangular"
        width="100%"
      />
    </Box>
  );
}
