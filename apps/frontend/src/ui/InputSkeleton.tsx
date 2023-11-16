import Skeleton from "@mui/joy/Skeleton";
import { FC } from "react";

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
      variant="rectangular"
      animation="wave"
      width={width}
      height={inputHeight}
    />
  );

  if (withLabel) {
    return (
      <>
        <Skeleton
          variant="text"
          animation="wave"
          width={72}
          height={20}
          sx={{
            mb: '6px',
          }}
        />

        {inputSkeleton}
      </>
    );
  }

  return inputSkeleton;
};
