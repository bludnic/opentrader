import Grid from "@mui/joy/Grid";
import Skeleton from "@mui/joy/Skeleton";
import React from "react";

export default function Loading() {
  return (
    <Grid container spacing={2}>
      <Grid md={9}>
        <Skeleton
          animation="wave"
          height={420}
          sx={{
            borderRadius: 8,
          }}
          variant="rectangular"
          width="100%"
        />
      </Grid>

      <Grid md={3}>
        <Skeleton
          animation="wave"
          height={232}
          sx={{
            borderRadius: 8,
          }}
          variant="rectangular"
          width="100%"
        />
      </Grid>
    </Grid>
  );
}
