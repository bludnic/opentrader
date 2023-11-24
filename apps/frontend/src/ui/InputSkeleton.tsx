import Skeleton from "@mui/joy/Skeleton";
import type { FC } from "react";

const inputHeight = 36;

type InputSkeletonProps = {
  withLabel?: boolean;
  width?: number | string;
};

export const InputSkeleton: FC<InputSkeletonProps> = ({
  width = "100%",
  withLabel,
}) => {
  const inputSkeleton = (
    <Skeleton
      animation="wave"
      height={inputHeight}
      variant="rectangular"
      width={width}
    />
  );

  if (withLabel) {
    return (
      <>
        <Skeleton
          animation="wave"
          height={20}
          sx={{
            mb: "6px",
          }}
          variant="text"
          width={72}
        />

        {inputSkeleton}
      </>
    );
  }

  return inputSkeleton;
};
