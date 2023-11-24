import Grid from "@mui/joy/Grid";
import Skeleton from "@mui/joy/Skeleton";
import type { FC } from "react";
import React from "react";

const BOTS_LENGTH = 8;

export const BotListSkeleton: FC = () => {
  const bots = Array.from({ length: BOTS_LENGTH });

  return (
    <Grid container spacing={2}>
      {bots.map((_, i) => (
        <Grid key={i} md={4} sm={6} xl={3} xs={12}>
          <Skeleton
            animation="wave"
            height={236}
            key={i}
            sx={{
              borderRadius: 8,
            }}
            variant="rectangular"
            width="100%"
          />
        </Grid>
      ))}
    </Grid>
  );
};
