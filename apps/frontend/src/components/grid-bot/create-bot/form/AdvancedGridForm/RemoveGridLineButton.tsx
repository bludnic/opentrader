import Button from "@mui/joy/Button";
import React, { FC } from "react";
import { removeGridLine } from "src/store/bot-form";
import { useAppDispatch } from "src/store/hooks";

type RemoveGridLineButtonProps = {
  gridLineIndex: number;
  className?: string;
};

export const RemoveGridLineButton: FC<RemoveGridLineButtonProps> = (props) => {
  const { className, gridLineIndex } = props;

  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(removeGridLine(gridLineIndex));
  };

  return (
    <Button
      className={className}
      onClick={handleRemove}
      color="danger"
      size="sm"
    >
      Remove
    </Button>
  );
};
