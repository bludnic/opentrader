import Grid from "@mui/joy/Grid";
import Skeleton from "@mui/joy/Skeleton";
import React from "react";

export default function Loading() {
  return (
    <Grid container spacing={2}>
      <Grid md={9}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height={420}
          sx={{
            borderRadius: 8,
          }}
        />
      </Grid>

      <Grid md={3}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height={232}
          sx={{
            borderRadius: 8,
          }}
        />
      </Grid>
    </Grid>
  );
}
