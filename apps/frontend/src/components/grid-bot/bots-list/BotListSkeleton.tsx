import Grid from "@mui/joy/Grid";
import Skeleton from "@mui/joy/Skeleton";
import React, { FC } from "react";

const BOTS_LENGTH = 8;

export const BotListSkeleton: FC = () => {
  const bots = Array.from({ length: BOTS_LENGTH });

  return (
    <Grid container spacing={2}>
      {bots.map((_, i) => (
        <Grid key={i} xl={3} md={4} sm={6} xs={12}>
          <Skeleton
            key={i}
            variant="rectangular"
            animation="wave"
            width="100%"
            height={236}
            sx={{
              borderRadius: 8,
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};
