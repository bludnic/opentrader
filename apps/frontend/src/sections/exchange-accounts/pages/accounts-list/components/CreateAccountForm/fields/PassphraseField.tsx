import { SxProps, Theme } from "@mui/material";
import { TextField } from "mui-rff";
import React, { FC } from "react";
import { CreateExchangeAccountFormValues } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountForm/types";

type PassphraseFieldProps = {
  className?: string;
  sx?: SxProps<Theme>;
};

const fieldName: keyof CreateExchangeAccountFormValues = "passphrase";

export const PassphraseField: FC<PassphraseFieldProps> = (props) => {
  const { sx, className } = props;

  return (
    <TextField
      className={className}
      label="Passphrase"
      name={fieldName}
      sx={sx}
      autoComplete="off"
    />
  );
};
