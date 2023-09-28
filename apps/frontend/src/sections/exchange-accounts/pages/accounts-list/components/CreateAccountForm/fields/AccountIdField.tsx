import { SxProps, Theme } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { FC } from "react";

type AccountIdFieldProps = {
  className?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  value?: number;
};

export const AccountIdField: FC<AccountIdFieldProps> = (props) => {
  const { sx, className, disabled, value } = props;

  return (
    <TextField
      className={className}
      label="Account ID"
      sx={sx}
      required
      value={value}
      disabled={disabled}
      autoComplete="off"
    />
  );
};
