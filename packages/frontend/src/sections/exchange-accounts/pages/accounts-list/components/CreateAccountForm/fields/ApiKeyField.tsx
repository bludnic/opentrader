import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { TextField } from "mui-rff";
import React, { FC } from "react";
import { CreateExchangeAccountFormValues } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountForm/types";

type ApiKeyFieldProps = {
  className?: string;
  sx?: SxProps<Theme>;
};

const fieldName: keyof CreateExchangeAccountFormValues = "apiKey";

export const ApiKeyField: FC<ApiKeyFieldProps> = (props) => {
  const { sx, className } = props;

  return (
    <TextField
      className={className}
      label="API Key"
      name={fieldName}
      sx={sx}
      required
      autoComplete="off"
    />
  );
};
