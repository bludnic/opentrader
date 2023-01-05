import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { TextField } from "mui-rff";
import React, { FC } from "react";
import { CreateExchangeAccountFormValues } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountForm/types";

type SecretKeyFieldProps = {
  className?: string;
  sx?: SxProps<Theme>;
};

const fieldName: keyof CreateExchangeAccountFormValues = "secretKey";

export const SecretKeyField: FC<SecretKeyFieldProps> = (props) => {
  const { sx, className } = props;

  return (
    <TextField
      className={className}
      label="Secret Key"
      name={fieldName}
      sx={sx}
      required
      autoComplete="off"
    />
  );
};
