import Skeleton from "@mui/joy/Skeleton";
import React, { FC } from "react";

const BOTS_LENGTH = 2;

export const BotListSkeleton: FC = () => {
  const bots = Array.from({ length: BOTS_LENGTH });

  return (
    <>
      {bots.map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          animation="wave"
          width="100%"
          height={232}
          sx={{
            borderRadius: 8,
            marginTop: i !== 0 ? "32px" : undefined,
          }}
        />
      ))}
    </>
  );
};
